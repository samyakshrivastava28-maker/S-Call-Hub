import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-24">
      <div className="absolute inset-0 bg-gradient-to-t from-s-gray-900 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="glass-panel p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <img src="/logo.png" alt="S-Call Hub" className="h-7 w-7 object-contain rounded-lg border border-white/5" referrerPolicy="no-referrer" />
              <h3 className="text-2xl font-display font-bold">S-Call Hub</h3>
            </div>
            <p className="text-s-gray-400 text-sm max-w-xs">
              Next-generation AI voice agents that automate customer support and outbound calling dynamically.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold tracking-wide text-sm uppercase text-s-gray-300">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-sm text-s-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/demos" className="hover:text-white transition-colors">AI Demos</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold tracking-wide text-sm uppercase text-s-gray-300">Connect</h4>
            <div className="flex flex-col space-y-3 text-sm text-s-gray-400">
              <a href="tel:8305500767" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone size={16} /> <span>8305500767</span>
              </a>
              <a href="https://wa.me/918305500767?text=Hello%20S-Call%20Hub!%20I'd%20like%20to%20know%20more%20about%20your%20AI%20Voice%20Agents." target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                <MessageCircle size={16} /> <span className="font-medium">WhatsApp</span>
              </a>
              <a href="mailto:s.callhub2811@gmail.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Mail size={16} /> <span>s.callhub2811@gmail.com</span>
              </a>
              <a href="https://www.instagram.com/s_call_hub2811?igsh=cGt0dTcycnR2MzJo" target="_blank" rel="noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors">
                <Instagram size={16} /> <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center flex flex-col items-center space-y-2">
          <p className="text-xs text-s-gray-500">© 2026 S-Call Hub. All rights reserved.</p>
          <a href="https://28webhub.netlify.app" target="_blank" rel="noreferrer" className="text-xs font-semibold text-s-gray-400 hover:text-white transition-colors">
            Website made by S-Web Hub
          </a>
        </div>
      </div>
    </footer>
  );
}
