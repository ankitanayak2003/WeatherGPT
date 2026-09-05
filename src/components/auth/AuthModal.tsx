import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserOccupation } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const OCCUPATION_OPTIONS: Array<{ value: UserOccupation; label: string; icon: string; desc: string }> = [
  { value: 'Farmer', label: 'Farmer', icon: '👨‍🌾', desc: 'Soil moisture, spray windows & rain alerts' },
  { value: 'Student', label: 'Student', icon: '🎓', desc: 'Campus transit, umbrella & rain hour timings' },
  { value: 'Professional', label: 'Professional', icon: '💼', desc: 'Commute visibility, cabin AC & indoor comfort' },
  { value: 'Driver', label: 'Driver', icon: '🚗', desc: 'Road friction, hydroplaning & squall alerts' },
  { value: 'Outdoor Worker', label: 'Outdoor Worker', icon: '🏗️', desc: 'UV index, wet-bulb heat stress & storm safety' },
  { value: 'Homemaker', label: 'Homemaker', icon: '🏠', desc: 'Laundry drying humidity & errand planning' },
  { value: 'Traveler', label: 'Traveler', icon: '🧳', desc: 'Flight gate weather, pack advice & tourist windows' },
  { value: 'Other', label: 'Other', icon: '⚡', desc: 'Custom meteorological heuristics' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { logIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [occupation, setOccupation] = useState<UserOccupation>('Student');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle(mode === 'signup' ? occupation : undefined);
      onClose();
    } catch (err: any) {
      console.warn('Google Auth notice:', err?.message || err);
      let msg = err?.message || 'Google Sign-In failed.';
      if (msg.includes('auth/popup-closed-by-user')) {
        msg = 'Google Sign-In was closed before completion. Please try again.';
      } else if (msg.includes('auth/cancelled-popup-request')) {
        msg = 'Previous sign-in popup was cancelled.';
      } else if (msg.includes('auth/popup-blocked')) {
        msg = 'Pop-up blocked by your browser. Please allow pop-ups for this site or open the app in a new window.';
      } else if (msg.includes('auth/operation-not-allowed')) {
        msg = 'Google Sign-In is not enabled yet in your Firebase Console. Please verify Auth providers.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUp(email.trim(), password, fullName.trim(), occupation);
      } else {
        await logIn(email.trim(), password);
      }
      onClose();
    } catch (err: any) {
      // Safe notification without triggering uncaught console errors
      console.warn('Auth notice:', err?.message || err);
      let msg = err?.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('auth/operation-not-allowed')) {
        msg = 'Email/Password provider is not enabled in Firebase Console for this project. Please click "Continue with Google" above to sign in.';
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = 'Invalid email or password. Please verify or create a new account.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please log in instead or use Google.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (msg.includes('auth/invalid-email')) {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#131b2e] border border-white/10 shadow-2xl p-6 sm:p-8 overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#38bdf8]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[#45dfa4]/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#38bdf8] to-[#45dfa4] flex items-center justify-center text-[#00354a] font-black shadow-md">
              <Sparkles className="w-5 h-5 text-[#00354a]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#dae2fd] tracking-tight">
                {mode === 'signup' ? 'Create WeatherGPT Account' : 'Welcome to WeatherGPT'}
              </h2>
              <p className="text-xs text-[#87929a]">
                {mode === 'signup'
                  ? 'Sign up to unlock personalized AI meteorological advice'
                  : 'Log in with Firebase to access your sync & personas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#87929a] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Primary Sign In Option */}
        <div className="pt-4 relative z-10">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-[#1f2937] font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-3.5 text-center z-10 flex items-center gap-3">
          <div className="h-[1px] bg-white/10 flex-1" />
          <span className="text-[10px] text-[#87929a] uppercase tracking-wider font-semibold">or email sign in</span>
          <div className="h-[1px] bg-white/10 flex-1" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-2 p-3 rounded-2xl bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 flex flex-col gap-2 text-xs text-[#ffb4ab] relative z-10 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-snug">{error}</span>
            </div>
            {error.includes('Email/Password provider is not enabled') && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-1 self-start px-3 py-1 rounded-lg bg-white text-[#1f2937] text-[11px] font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Sign in with Google now
              </button>
            )}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 relative z-10">
          {/* Sign Up: Full Name */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#dae2fd] mb-1.5">
                Full Name <span className="text-[#38bdf8]">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87929a]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Ankita Nayak"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1e293b]/70 text-xs text-[#dae2fd] border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] transition-all placeholder:text-[#87929a]"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#dae2fd] mb-1.5">
              Email Address <span className="text-[#38bdf8]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87929a]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1e293b]/70 text-xs text-[#dae2fd] border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] transition-all placeholder:text-[#87929a]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#dae2fd] mb-1.5">
              Password <span className="text-[#38bdf8]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87929a]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter password'}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1e293b]/70 text-xs text-[#dae2fd] border border-white/5 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] transition-all placeholder:text-[#87929a]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87929a] hover:text-[#dae2fd]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign Up: Occupation Selection Grid */}
          {mode === 'signup' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#dae2fd]">
                  Occupation <span className="text-[#38bdf8]">*</span>
                </label>
                <span className="text-[10px] text-[#45dfa4] font-medium">
                  Powers AI weather advice
                </span>
              </div>
              <p className="text-[11px] text-[#87929a] mb-2 leading-relaxed">
                WeatherGPT tailors precipitation windows, UV warnings, and transit tips specifically for your persona.
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {OCCUPATION_OPTIONS.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setOccupation(item.value)}
                    className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      occupation === item.value
                        ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#dae2fd] shadow-sm'
                        : 'bg-[#1e293b]/50 border-white/5 text-[#87929a] hover:bg-[#1e293b] hover:text-[#dae2fd]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{item.icon}</span>
                      <span className={`text-xs font-bold ${occupation === item.value ? 'text-[#38bdf8]' : 'text-[#dae2fd]'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#87929a] line-clamp-1">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#38bdf8] to-[#45dfa4] text-[#00354a] font-bold text-xs tracking-wide uppercase hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === 'signup' ? 'Creating Account...' : 'Signing in...'}</span>
              </>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Account' : 'Log In with Firebase'}</span>
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="pt-3 border-t border-white/5 text-center text-xs text-[#87929a] relative z-10 flex items-center justify-center gap-1.5">
          {mode === 'login' ? (
            <>
              <span>Don&apos;t have an account?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-[#38bdf8] font-bold hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#38bdf8] font-bold hover:underline"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
