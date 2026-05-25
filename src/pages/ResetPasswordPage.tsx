import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      setError('Invalid link parameters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update your password.');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-display font-bold mb-2">New Password</h1>
          <p className="text-s-gray-400 text-sm">Enter your new secure account password.</p>
        </div>

        {error && (
          <div className="mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl break-words">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-5 py-4">
            <div className="flex justify-center">
              <CheckCircle2 size={48} className="text-emerald-400 animate-bounce" />
            </div>
            <p className="text-sm text-s-gray-300">
              Your password has been reset successfully! You can now sign in with your new password.
            </p>
            <Link 
              to="/login" 
              className="glass-button block w-full py-3.5 text-sm font-medium text-center"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <input 
                type="email" 
                disabled 
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-s-gray-500 select-none cursor-not-allowed" 
                value={email}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  disabled={!token || !email || loading}
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

            <div>
              <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <input 
                type="password"
                required 
                disabled={!token || !email || loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-ring" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !token || !email} 
              className="glass-button w-full py-3.5 mt-2"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-s-gray-500 hover:text-white transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
