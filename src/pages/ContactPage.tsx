import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-use logic or prompt a modal
    alert("Form submitted! We will contact you soon.");
  };

  return (
    <div className="pt-32 pb-24 min-h-screen relative">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-s-gray-400 max-w-xl mx-auto">Get in touch to deploy custom AI voice agents for your workflow.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-display font-semibold mb-6">Contact Information</h3>
              <div className="space-y-6">
                
                <a href="mailto:s.callhub2811@gmail.com" className="flex items-start space-x-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                    <Mail size={18} className="text-s-gray-300 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Email</p>
                    <p className="text-sm text-s-gray-400">s.callhub2811@gmail.com</p>
                  </div>
                </a>

                <a href="https://wa.me/918305500767?text=Hello%20S-Call%20Hub!%20I'd%20like%20to%20know%20more%20about%20your%20AI%20Voice%20Agents." target="_blank" rel="noreferrer" className="flex items-start space-x-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors">
                    <MessageCircle size={18} className="text-emerald-400 group-hover:text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">WhatsApp</p>
                    <p className="text-sm text-s-gray-400">+91 83055 00767</p>
                  </div>
                </a>

                <a href="https://www.instagram.com/s_call_hub2811?igsh=cGt0dTcycnR2MzJo" target="_blank" rel="noreferrer" className="flex items-start space-x-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                    <Instagram size={18} className="text-s-gray-300 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Instagram</p>
                    <p className="text-sm text-s-gray-400">@s_call_hub2811</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="glass-panel p-8 overflow-hidden relative min-h-[200px] flex items-center justify-center text-center">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
               <p className="relative z-10 font-display text-xl text-s-gray-300 font-light">"The quickest path to automation starts with a bold conversation."</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8 lg:p-10"
          >
            <h3 className="text-2xl font-display font-semibold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">First Name</label>
                  <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-ring" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">Last Name</label>
                  <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-ring" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-ring" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-s-gray-400 mb-1.5 uppercase tracking-wide">Message</label>
                <textarea required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus-ring resize-none" placeholder="How can we help automate your business?" />
              </div>
              <button type="submit" className="glass-button w-full py-4 mt-2">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
