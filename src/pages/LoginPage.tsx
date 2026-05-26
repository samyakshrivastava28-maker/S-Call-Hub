import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import AuthDiagnostics from '../components/AuthDiagnostics';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [diagError, setDiagError] = useState<{ code: string; message: string } | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Hit backend to trigger login notification emails (Primary for demo)
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'firebase-user' })
      });
      const data = await res.json();
      
      try {
        // Firebase Auth (Secondary)
        await signInWithEmailAndPassword(auth, email, password);
      } catch (fbErr: any) {
        console.warn("Firebase Auth Error (Fallback mode active):", fbErr);
        if (!data.success) {
          throw fbErr; // If backend also fails, throw error
        }
      }

      navigate('/agents');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
        setDiagError({ code: err.code, message: err.message });
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    }
    setLoading(false);
  };

  const { signInWithGoogle } = useAuth();
  
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    setDiagError(null);
    try {
      const user = await signInWithGoogle();
      
      if (user) {
        await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, password: 'firebase-user' })
        }).catch(console.error);
      }

      navigate('/agents');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        console.error(err);
        const code = err.code || 'unknown';
        const msg = err.message || 'Failed to connect with Google.';
        setError(msg);
        setDiagError({ code, message: msg });
      }
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-s-black to-s-black pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
          <p className="text-s-gray-400 text-sm">Sign in to your S-Call Hub account.</p>
        </div>

        {error && (
          <div className="mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl break-words flex flex-col gap-1.5">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setDiagError({ code: 'auth/invalid-credential', message: error })}
              className="text-left text-[11px] text-amber-400 hover:text-amber-300 underline font-medium transition-colors w-fit"
            >
              🛠️ Click here for step-by-step developer troubleshooting instructions
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
            <input 
              type="email" 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-ring" 
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-s-gray-400 uppercase tracking-wide">Password</label>
              <Link to="/forgot-password" className="text-xs text-s-gray-500 hover:text-white transition-colors">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                required 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus-ring" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-s-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="glass-button w-full py-3.5 mt-2">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-white/10" />
          <span className="px-4 text-xs text-s-gray-500 uppercase tracking-wide">Or</span>
          <hr className="w-full border-white/10" />
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          disabled={googleLoading}
          className="mt-6 w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-xl flex items-center justify-center space-x-3 text-sm font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        {window.self !== window.top && (
          <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 rounded-xl leading-relaxed text-center">
            <span className="font-semibold text-white block mb-0.5">⚠️ Google Login inside Iframe</span>
            Google popups are blocked inside preview builders. To log in with Google, click{' '}
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline font-bold text-white hover:text-amber-200 inline-flex items-center space-x-1"
            >
              <span>Open in New Tab ↗</span>
            </a>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-s-gray-500">
          Don't have an account? <Link to="/signup" className="text-white hover:underline">Sign up</Link>
        </p>
      </motion.div>

      {diagError && (
        <AuthDiagnostics 
          errorCode={diagError.code}
          errorMessage={diagError.message}
          onClose={() => setDiagError(null)}
        />
      )}
    </div>
  );
}
