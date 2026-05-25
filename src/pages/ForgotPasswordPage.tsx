import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await resetPassword(email);
      setMessage('A secure password reset link has been sent to your email by Firebase. Please check your inbox and follow the instructions to recover your password.');
    } catch (err: any) {
      console.error('Firebase password reset failed:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
    }
    setLoading(false);
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
          <h1 className="text-3xl font-display font-bold mb-2">Reset Password</h1>
          <p className="text-s-gray-400 text-sm">Enter your email to receive a password reset link.</p>
        </div>

        {error && (
          <div className="mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl break-words">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 text-xs bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl break-words">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
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
          
          <button type="submit" disabled={loading} className="glass-button w-full py-3.5 mt-2">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-s-gray-500">
          Remember your password? <Link to="/login" className="text-white hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
