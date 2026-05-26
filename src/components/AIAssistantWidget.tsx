import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Hi! I am the S-Call Hub Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show tooltip on load after a slight delay
    const initialTimer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 2000);

    // Pop up the tooltip if closed every 30 seconds
    const interval = setInterval(() => {
      setIsOpen(p => {
        if (!p) {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 5000);
        }
        return p;
      });
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(p => [...p, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          systemInstruction: "You are a helpful AI assistant for S-Call Hub. You MUST answer every question the user asks. Keep your answers extremely concise (1-2 sentences max) for high speed. If the user asks for the price, pricing, or cost, you MUST instruct them to use the 'Book a Call' button on the menu or visit the [Contact Page](/contact)."
        })
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }
      
      setMessages(p => [...p, { role: 'ai', text: data.text || "Sorry, I couldn't process that." }]);
    } catch (err: any) {
      console.error(err);
      setMessages(p => [...p, { role: 'ai', text: `Connection error: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end ${isOpen ? 'hidden' : 'flex'}`}>
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-4 bg-white text-black px-4 py-2.5 rounded-2xl rounded-br-sm shadow-xl flex items-center space-x-2 border border-black/5"
            >
              <span className="text-sm font-medium">S-Call Hub Support</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                className="text-gray-400 hover:text-black transition-colors"
                aria-label="Close message"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => {
            setIsOpen(true);
            setShowTooltip(false);
          }}
          className="p-4 rounded-full bg-white text-black shadow-xl md:shadow-2xl hover:scale-105 transition-transform"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-32px)] md:w-[90vw] max-w-[380px] h-[500px] max-h-[75vh] bg-s-black border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/10 flex items-center justify-between relative overflow-hidden">
              {isTyping && (
                <motion.div
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
                />
              )}
              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                  {isTyping && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-white/20"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
                        className="absolute inset-0 rounded-full bg-white/30"
                      />
                    </>
                  )}
                  <motion.div 
                    animate={{ scale: isTyping ? [1, 0.95, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  >
                    <Bot size={18} />
                  </motion.div>
                </div>
                <div>
                  <h3 className="font-medium text-sm flex items-center">
                    S-Call Hub Support
                    {isTyping && (
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-2 w-1.5 h-1.5 rounded-full bg-white" 
                      />
                    )}
                  </h3>
                  <div className="flex items-center space-x-1.5">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-1.5 h-1.5 rounded-full bg-green-400" 
                    />
                    <p className="text-xs text-green-400">{isTyping ? 'Typing...' : 'Online'}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-s-gray-400 hover:text-white transition-colors relative z-10">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                    {msg.role === 'ai' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-a:text-s-gray-300 prose-a:underline hover:prose-a:text-white prose-p:my-0 prose-p:leading-relaxed">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/5 bg-s-black">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus-ring"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-s-gray-400 hover:text-white disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
