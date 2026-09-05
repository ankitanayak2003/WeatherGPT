import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testFirestoreConnection } from '../services/firebase';
import { UserProfile, UserOccupation, LocationInfo } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isLoginAnimating: boolean;
  loginAnimationData: {
    name: string;
    occupation: UserOccupation;
  } | null;
  signUp: (email: string, pass: string, fullName: string, occupation: UserOccupation) => Promise<void>;
  logIn: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: (preferredOccupation?: UserOccupation) => Promise<void>;
  logOut: () => Promise<void>;
  updateOccupation: (occupation: UserOccupation) => Promise<void>;
  updatePreferredUnit: (unit: 'celsius' | 'fahrenheit') => Promise<void>;
  finishLoginAnimation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_LOCATION: LocationInfo = {
  id: 'mysuru-default',
  name: 'Mysuru',
  region: 'Karnataka',
  country: 'India',
  latitude: 12.2958,
  longitude: 76.6394,
  isDefault: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginAnimating, setIsLoginAnimating] = useState<boolean>(false);
  const [loginAnimationData, setLoginAnimationData] = useState<{
    name: string;
    occupation: UserOccupation;
  } | null>(null);

  // Initialize and verify Firestore on load
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    // Restore saved local profile if no active Firebase session
    const savedLocal = localStorage.getItem('weathergpt_local_profile');
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        setUserProfile(parsed);
      } catch (e) {
        // ignore parse error
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create profile in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            // Initialize fresh profile
            const rawName = user.displayName?.trim() || user.email?.split('@')[0] || 'Meteorologist';
            const safeName = rawName.slice(0, 100);
            const safeEmail = (user.email || `${user.uid}@example.com`).slice(0, 150);

            const newProfile: UserProfile = {
              uid: user.uid,
              name: safeName,
              email: safeEmail,
              occupation: 'Student',
              preferredUnit: 'celsius',
              defaultLocation: DEFAULT_LOCATION,
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err: any) {
          console.warn('Could not sync profile from Firestore:', err);
          // Local fallback in case of security rules or connection delay
          const rawName = user.displayName?.trim() || user.email?.split('@')[0] || 'Meteorologist';
          setUserProfile({
            uid: user.uid,
            name: rawName.slice(0, 100),
            email: (user.email || `${user.uid}@example.com`).slice(0, 150),
            occupation: 'Student',
            preferredUnit: 'celsius',
            defaultLocation: DEFAULT_LOCATION,
          });
        }
      } else {
        const localSaved = localStorage.getItem('weathergpt_local_profile');
        if (localSaved) {
          try {
            setUserProfile(JSON.parse(localSaved));
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string, fullName: string, occupation: UserOccupation) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: fullName });
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          name: fullName.slice(0, 100),
          email: email.slice(0, 150),
          occupation: occupation,
          preferredUnit: 'celsius',
          defaultLocation: DEFAULT_LOCATION,
        };

        const path = `users/${cred.user.uid}`;
        try {
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }

        setUserProfile(newProfile);
        setLoginAnimationData({ name: fullName, occupation });
        setIsLoginAnimating(true);
      }
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        // Fallback for projects where Email/Password auth provider is not enabled in Firebase Console
        const localUid = 'usr_' + Math.random().toString(36).substring(2, 9);
        const fallbackProfile: UserProfile = {
          uid: localUid,
          name: (fullName || email.split('@')[0] || 'Meteorologist').slice(0, 100),
          email: email.slice(0, 150),
          occupation: occupation,
          preferredUnit: 'celsius',
          defaultLocation: DEFAULT_LOCATION,
        };
        localStorage.setItem('weathergpt_local_profile', JSON.stringify(fallbackProfile));
        setUserProfile(fallbackProfile);
        setLoginAnimationData({ name: fallbackProfile.name, occupation });
        setIsLoginAnimating(true);
        return;
      }
      throw err;
    }
  };

  const logIn = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        let profileName = cred.user.displayName || email.split('@')[0];
        let profileOcc: UserOccupation = 'Student';

        try {
          const snap = await getDoc(doc(db, 'users', cred.user.uid));
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            profileName = data.name;
            profileOcc = data.occupation;
            setUserProfile(data);
          }
        } catch (e) {
          console.warn('Profile read on login notice:', e);
        }

        setLoginAnimationData({
          name: profileName,
          occupation: profileOcc,
        });
        setIsLoginAnimating(true);
      }
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        // Fallback for projects where Email/Password auth provider is not enabled in Firebase Console
        let profileName = email.split('@')[0];
        let profileOcc: UserOccupation = 'Student';
        const saved = localStorage.getItem('weathergpt_local_profile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            profileName = parsed.name || profileName;
            profileOcc = parsed.occupation || profileOcc;
          } catch (e) {}
        }
        const localUid = 'usr_' + Math.random().toString(36).substring(2, 9);
        const fallbackProfile: UserProfile = {
          uid: localUid,
          name: profileName.slice(0, 100),
          email: email.slice(0, 150),
          occupation: profileOcc,
          preferredUnit: 'celsius',
          defaultLocation: DEFAULT_LOCATION,
        };
        localStorage.setItem('weathergpt_local_profile', JSON.stringify(fallbackProfile));
        setUserProfile(fallbackProfile);
        setLoginAnimationData({ name: profileName, occupation: profileOcc });
        setIsLoginAnimating(true);
        return;
      }
      throw err;
    }
  };

  const signInWithGoogle = async (preferredOccupation?: UserOccupation) => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
      const user = cred.user;
      const userDocRef = doc(db, 'users', user.uid);
      const rawName = user.displayName?.trim() || user.email?.split('@')[0] || 'Meteorologist';
      const safeName = rawName.slice(0, 100);
      const safeEmail = (user.email || `${user.uid}@example.com`).slice(0, 150);

      let profileName = safeName;
      let profileOcc: UserOccupation = preferredOccupation || 'Student';

      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          profileName = data.name;
          if (preferredOccupation && preferredOccupation !== data.occupation) {
            profileOcc = preferredOccupation;
            await updateDoc(userDocRef, { occupation: preferredOccupation });
            data.occupation = preferredOccupation;
          } else {
            profileOcc = data.occupation;
          }
          setUserProfile(data);
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            name: safeName,
            email: safeEmail,
            occupation: profileOcc,
            preferredUnit: 'celsius',
            defaultLocation: DEFAULT_LOCATION,
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
        }
      } catch (err: any) {
        console.warn('Could not sync user profile with Firestore:', err);
        setUserProfile({
          uid: user.uid,
          name: safeName,
          email: safeEmail,
          occupation: profileOcc,
          preferredUnit: 'celsius',
          defaultLocation: DEFAULT_LOCATION,
        });
      }

      setLoginAnimationData({
        name: profileName,
        occupation: profileOcc,
      });
      setIsLoginAnimating(true);
    }
  };

  const logOut = async () => {
    localStorage.removeItem('weathergpt_local_profile');
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    setUserProfile(null);
    setCurrentUser(null);
  };

  const updateOccupation = async (occupation: UserOccupation) => {
    if (userProfile) {
      const updated = { ...userProfile, occupation };
      setUserProfile(updated);
      localStorage.setItem('weathergpt_local_profile', JSON.stringify(updated));
      if (currentUser) {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), { occupation });
        } catch (err) {
          console.warn('Could not update occupation in Firestore:', err);
        }
      }
    }
  };

  const updatePreferredUnit = async (preferredUnit: 'celsius' | 'fahrenheit') => {
    if (userProfile) {
      const updated = { ...userProfile, preferredUnit };
      setUserProfile(updated);
      localStorage.setItem('weathergpt_local_profile', JSON.stringify(updated));
      if (currentUser) {
        try {
          await updateDoc(doc(db, 'users', currentUser.uid), { preferredUnit });
        } catch (err) {
          console.warn('Could not update preferredUnit in Firestore:', err);
        }
      }
    }
  };

  const finishLoginAnimation = () => {
    setIsLoginAnimating(false);
    setLoginAnimationData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isLoginAnimating,
        loginAnimationData,
        signUp,
        logIn,
        signInWithGoogle,
        logOut,
        updateOccupation,
        updatePreferredUnit,
        finishLoginAnimation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
