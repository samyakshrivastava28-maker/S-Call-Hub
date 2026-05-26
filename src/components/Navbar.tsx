import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import BookCallModal from './BookCallModal';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Agents', path: '/agents' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-s-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 text-xl font-display font-bold tracking-tight z-50 relative group">
            <img src="/logo.png" alt="S-Call Hub" className="h-8 w-8 object-contain rounded-lg border border-white/5 group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
            <span>S-<span className="text-s-gray-400">Call Hub</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm tracking-wide transition-colors ${location.pathname === link.path ? 'text-white' : 'text-s-gray-400 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-sm tracking-wide text-s-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="text-sm tracking-wide text-s-gray-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="glass-button px-6 py-2.5 text-sm"
            >
              Book A Call
            </button>
          </div>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden text-white z-50 relative"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 w-full h-screen bg-s-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 px-6"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`text-2xl font-display transition-colors ${location.pathname === link.path ? 'text-white' : 'text-s-gray-400'}`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="text-2xl font-display text-s-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-display text-s-gray-400 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
            <button 
              onClick={() => {
                setMobileOpen(false);
                setIsModalOpen(true);
              }}
              className="glass-button px-8 py-3 text-lg mt-4 w-full max-w-xs"
            >
              Book A Call
            </button>
          </motion.div>
        )}
      </motion.nav>

      <BookCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
