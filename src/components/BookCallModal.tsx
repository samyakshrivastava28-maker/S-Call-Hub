import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookCallModal({ isOpen, onClose }: BookCallModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    work: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to DB via backend proxy
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch(err) {
      console.error(err);
    }
    
    // Construct WhatsApp Link
    const message = `Hello S-Call Hub! I'd like to request a free real call demo.%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Phone Number:* ${encodeURIComponent(formData.phone)}%0A*Work:* ${encodeURIComponent(formData.work)}%0A*Time Window:* ${encodeURIComponent(formData.time)}`;
    const whatsappUrl = `https://wa.me/918305500767?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-panel p-8 z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-s-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-display font-semibold mb-2">Request A Call</h2>
            <p className="text-s-gray-400 text-sm mb-6">Enter your details. We'll direct you to connect with WhatsApp and arrange a live callback.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-s-gray-400 mb-1 tracking-wide uppercase">Full Name</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus-ring"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-s-gray-400 mb-1 tracking-wide uppercase">Phone Number</label>
                <input 
                  required
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus-ring"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-s-gray-400 mb-1 tracking-wide uppercase">Work / Organization</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus-ring"
                  placeholder="Real Estate, Sales, Agency, etc."
                  value={formData.work}
                  onChange={(e) => setFormData({...formData, work: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-s-gray-400 mb-1 tracking-wide uppercase">Best time to receive our call</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus-ring"
                  placeholder="e.g. 10:00 AM - 1:00 PM"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold py-3.5 mt-4 rounded-xl flex items-center justify-center space-x-2 text-white transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
              >
                <span>{isSubmitting ? 'Connecting...' : 'Connect directly with WhatsApp'}</span>
                {!isSubmitting && <Send size={16} />}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
