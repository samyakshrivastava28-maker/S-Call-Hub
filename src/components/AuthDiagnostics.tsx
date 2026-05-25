import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clipboard, 
  Check, 
  ExternalLink, 
  X, 
  Globe, 
  Lock, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface AuthDiagnosticsProps {
  errorCode: string;
  errorMessage: string;
  onClose: () => void;
}

export default function AuthDiagnostics({ errorCode, errorMessage, onClose }: AuthDiagnosticsProps) {
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedProd, setCopiedProd] = useState(false);

  // Parse dev hostname and generate matching production hostname
  const currentHost = window.location.hostname;
  const devAppUrl = currentHost;
  
  // Try to reconstruct the shared / production preview URL
  let prodAppUrl = 'ais-pre-ijiclcmi2hmvliamoqtmed-644759808483.asia-east1.run.app';
  if (currentHost.includes('ais-dev')) {
    prodAppUrl = currentHost.replace('ais-dev', 'ais-pre');
  }

  const copyToClipboard = (text: string, isDev: boolean) => {
    navigator.clipboard.writeText(text);
    if (isDev) {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } else {
      setCopiedProd(true);
      setTimeout(() => setCopiedProd(false), 2000);
    }
  };

  // Check which issue it is
  const isUnauthorizedDomain = errorCode === 'auth/unauthorized-domain' || errorMessage.toLowerCase().includes('unauthorized domain') || errorMessage.toLowerCase().includes('unauthorized-domain');
  const isOperationNotAllowed = errorCode === 'auth/operation-not-allowed' || errorMessage.toLowerCase().includes('operation-not-allowed') || errorMessage.toLowerCase().includes('operation not allowed');
  const isPopupBlocked = errorCode === 'auth/popup-blocked' || errorMessage.toLowerCase().includes('popup-blocked') || errorMessage.toLowerCase().includes('popup blocked');
  const isInvalidCredential = errorCode === 'auth/invalid-credential' || errorMessage.toLowerCase().includes('invalid-credential') || errorMessage.toLowerCase().includes('invalid credential');

  if (!isUnauthorizedDomain && !isOperationNotAllowed && !isPopupBlocked && !isInvalidCredential) {
    // General / Unknown connection error
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-s-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold font-display text-white mb-1">Google Connection Problem</h3>
                <p className="text-xs text-s-gray-400 font-mono mb-4 break-words">ERROR CODE: {errorCode || 'auth/unknown'}</p>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-sm text-s-gray-300 leading-relaxed mb-5">
                  {errorMessage || "Standard Google pop-up integration threw an exception. Check your network or verify if Google Auth can open in a clean tab."}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Troubleshooting Steps</h4>
                  <ul className="text-xs text-s-gray-400 space-y-2 list-decimal pl-4">
                    <li>Open this application in a <strong>new browser tab</strong> instead of the builder iframe, then try clicking login.</li>
                    <li>Ensure you are signed into Google in this browser profile.</li>
                    <li>If using adblockers or privacy extensions, try pausing them briefly.</li>
                  </ul>
                </div>

                <button 
                  onClick={onClose}
                  className="mt-6 w-full py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Header Status Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          
          <button 
            onClick={onClose}
            className="absolute right-4 top-5 text-s-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Diagnosis Specifics */}
            {isUnauthorizedDomain && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Globe size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">Authorize Your Preview Domain</h3>
                    <p className="text-xs text-s-gray-400 uppercase tracking-widest font-mono mt-0.5">Firebase Configuration Required</p>
                  </div>
                </div>

                <p className="text-sm text-s-gray-300 leading-relaxed mb-6">
                  Firebase Authentication requires security domains to be registered in your Firebase console. Because AI Studio runs on sandbox preview URLs, they must be added to your authorized login domains list.
                </p>

                <div className="space-y-4 mb-6">
                  {/* Domain Dev Box */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="min-w-0 pr-4">
                      <span className="block text-[10px] text-s-gray-500 font-mono uppercase">Development Preview Domain</span>
                      <span className="block text-sm text-white font-mono break-all mt-1">{devAppUrl}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(devAppUrl, true)}
                      className="px-3 py-2 shrink-0 bg-white/5 hover:bg-white/10 text-xs rounded-lg transition-colors flex items-center space-x-1.5 border border-white/10"
                    >
                      {copiedDev ? <Check size={13} className="text-emerald-400" /> : <Clipboard size={13} />}
                      <span>{copiedDev ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Domain Prod Box */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="min-w-0 pr-4">
                      <span className="block text-[10px] text-s-gray-500 font-mono uppercase">Shared/Production Domain</span>
                      <span className="block text-sm text-white font-mono break-all mt-1">{prodAppUrl}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(prodAppUrl, false)}
                      className="px-3 py-2 shrink-0 bg-white/5 hover:bg-white/10 text-xs rounded-lg transition-colors flex items-center space-x-1.5 border border-white/10"
                    >
                      {copiedProd ? <Check size={13} className="text-emerald-400" /> : <Clipboard size={13} />}
                      <span>{copiedProd ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Steps */}
                <div className="space-y-3 text-sm text-s-gray-300">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">1</div>
                    <span>
                      Open your Google Firebase Auth Settings Page:{' '}
                      <a 
                        href="https://console.firebase.google.com/project/gen-lang-client-0409729365/authentication/settings" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-400 hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Console Settings</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">2</div>
                    <span>Scroll down to <strong>Authorized domains</strong> and click <strong>Add domain</strong>.</span>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">3</div>
                    <span>Paste both domains copied above, hit save, and login will work instantly!</span>
                  </div>
                </div>
              </div>
            )}

            {isOperationNotAllowed && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <Lock size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">Enable Google in Firebase</h3>
                    <p className="text-xs text-s-gray-400 uppercase tracking-widest font-mono mt-0.5">Sign-in Method Disabled</p>
                  </div>
                </div>

                <p className="text-sm text-s-gray-300 leading-relaxed mb-6">
                  The Google Sign-In provider option is not turned on in your Firebase Project console yet. You need to enable it for login to proceed.
                </p>

                <div className="space-y-4 text-sm text-s-gray-300 border-l border-white/10 pl-4 py-1 mb-6">
                  <p>
                    <strong>1. Go to Sign-In Providers:</strong>{' '}
                    <a 
                      href="https://console.firebase.google.com/project/gen-lang-client-0409729365/authentication/providers" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-orange-400 hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Providers Panel</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </p>
                  <p><strong>2. Add New Provider:</strong> Click on "Add New Provider" and select <strong>Google</strong>.</p>
                  <p><strong>3. Configure:</strong> Flip the toggle to <strong>Enable</strong>, select your support email address, and click <strong>Save</strong>.</p>
                </div>
              </div>
            )}

            {isPopupBlocked && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <AlertCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">Login Popup Blocked</h3>
                    <p className="text-xs text-s-gray-400 uppercase tracking-widest font-mono mt-0.5">Browser Access Blocked</p>
                  </div>
                </div>

                <p className="text-sm text-s-gray-300 leading-relaxed mb-6">
                  Your browser blocked the Google authentication popup. Firebase needs to spawn a popup window to secure your Google credential.
                </p>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-sm space-y-3 leading-relaxed mb-6">
                  <p className="text-white font-medium mb-1">💡 Bulletproof Solution:</p>
                  <div className="flex items-start space-x-2">
                    <ChevronRight size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>
                      <a 
                        href={window.location.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-400 font-bold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Open in a Clean Tab</span>
                        <ExternalLink size={13} />
                      </a>{' '}
                      - Opens S-Call Hub in a new browser tab where popups are <strong>never</strong> blocked!
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ChevronRight size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <span>Or look closely at your browser's address bar (often a red icon or window-locked glyph on the right) and select "Always allow popups".</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ChevronRight size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <span>Or use the standard Email & Password form as a backup. No popups are required for direct email login!</span>
                  </div>
                </div>

                <div className="mt-4">
                  <a 
                    href={window.location.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl transition-all duration-300 text-center flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                  >
                    <span>⚡ Open S-Call Hub in New Tab</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}

            {isInvalidCredential && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 animate-pulse">
                    <Lock size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">Authentication Mismatch</h3>
                    <p className="text-xs text-s-gray-400 uppercase tracking-widest font-mono mt-0.5">Firebase Error: auth/invalid-credential</p>
                  </div>
                </div>

                <p className="text-sm text-s-gray-300 leading-relaxed mb-6">
                  Firebase has rejected the authentication attempt with an <strong>invalid-credential</strong> error. Depending on your situation, this has two highly straightforward fixes:
                </p>

                <div className="space-y-4 mb-6">
                  {/* Option 1: End-User */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-sm">👤</span>
                      <span className="text-xs font-semibold text-white uppercase tracking-wide">For General Users Info</span>
                    </div>
                    <p className="text-xs text-s-gray-400 leading-relaxed">
                      You entered an invalid email or password combination, or your account doesn't exist yet under this provider. To get started, you can register a secure new profile instantly.
                    </p>
                    <div className="mt-2.5">
                      <Link to="/signup" onClick={onClose} className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center space-x-1 underline">
                        <span>Register a New Account Here ↗</span>
                      </Link>
                    </div>
                  </div>

                  {/* Option 2: Developer */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-sm">🛠️</span>
                      <span className="text-xs font-semibold text-white uppercase tracking-wide">For Project Developers Settings</span>
                    </div>
                    <p className="text-xs text-s-gray-400 leading-relaxed">
                      If you recently cloned or set up this Firebase database, the <strong>Email/Password</strong> and <strong>Google</strong> authentication methods might not be turned on inside your Firebase Console setting.
                    </p>
                    <div className="mt-2.5">
                      <a 
                        href="https://console.firebase.google.com/project/gen-lang-client-0409729365/authentication/providers" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center space-x-1 underline"
                      >
                        <span>Enable Email/Password & Google Sign-In ↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Action */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-s-gray-500 font-mono">
                <Sparkles size={13} className="text-neutral-400 animate-pulse" />
                <span>Project ID: gen-lang-client-0409729365</span>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button 
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium text-xs rounded-xl transition-all border border-white/10"
                >
                  Dismiss Instructions
                </button>
                {isUnauthorizedDomain && (
                  <a 
                    href="https://console.firebase.google.com/project/gen-lang-client-0409729365/authentication/settings" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all text-center inline-flex items-center justify-center space-x-2"
                  >
                    <span>Open Firebase</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                {isOperationNotAllowed && (
                  <a 
                    href="https://console.firebase.google.com/project/gen-lang-client-0409729365/authentication/providers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all text-center inline-flex items-center justify-center space-x-2"
                  >
                    <span>Enable Provider</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                {isInvalidCredential && (
                  <a 
                    href="https://console.firebase.google.com/project/gen-lang-client-0409729365/authentication/providers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all text-center inline-flex items-center justify-center space-x-2"
                  >
                    <span>Configure Providers</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
