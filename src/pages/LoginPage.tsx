import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

interface StoredUser {
  email: string;
  password: string;
}

const USERS_STORAGE_KEY = 'netcidr-users';

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!rawUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(rawUsers) as StoredUser[];
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage failures in private browsing or restricted environments.
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!normalizedEmail || !isValidEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const users = getStoredUsers();

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter them.');
        return;
      }

      if (users.some((user) => user.email === normalizedEmail)) {
        setError('An account with this email already exists. Please log in instead.');
        return;
      }

      const updatedUsers = [...users, { email: normalizedEmail, password }];
      saveStoredUsers(updatedUsers);
      onLogin(normalizedEmail);
      return;
    }

    const matchedUser = users.find((user) => user.email === normalizedEmail && user.password === password);

    if (!matchedUser) {
      setError('Incorrect email or password. If you do not have an account, sign up first.');
      return;
    }

    onLogin(normalizedEmail);
  };

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'signup' : 'login'));
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.2),_transparent_30%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-slate-900/75 p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-2.5 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-300/80">NetCIDR</p>
                <h1 className="text-xl font-bold text-slate-50">Secure Access</h1>
              </div>
            </div>
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
              Protected
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-slate-400">
              {mode === 'login'
                ? 'Use your email and password to continue to the subnet calculator.'
                : 'Create a free account to save and manage your subnet planning work.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20">
                <UserRound className="h-4 w-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full border-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20">
                <LockKeyhole className="h-4 w-4 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full border-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-slate-400 transition hover:text-cyan-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' ? (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
                  Confirm password
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20">
                  <LockKeyhole className="h-4 w-4 text-slate-500" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full border-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:brightness-110"
            >
              {mode === 'login' ? 'Log in' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>{mode === 'login' ? 'Need an account?' : 'Already have an account?'}</span>
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
