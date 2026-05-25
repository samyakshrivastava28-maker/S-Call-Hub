import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2, Send, MessageSquare, Bot, PhoneOff, BarChart3, TrendingUp } from 'lucide-react';
import Markdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import WaveformVisualizer from '../components/WaveformVisualizer';
import BookCallModal from '../components/BookCallModal';
import MicTestWidget from '../components/MicTestWidget';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export default function AIDemosPage() {
  const [activeDemo, setActiveDemo] = useState<any | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const BASE_PROMPT = `You are a highly realistic, warm, extremely human customer support professional representing S-Call Hub. You are talking to a customer, and you must operate with total realism and helpful agency knowledge.

Human-Like Conversational Style Rules:
- You MUST Sound completely like a real human call assistant. Use natural, brief filler words or casual interjections like "ahh!", "um...", "Oh!", "got it!", "right...", "sure!", "makes sense" occasionally to mirror human speech and pauses.
- Never list out bullet points over a phone call; instead, speak in fluid, conversational sentences.
- Never sound robotic or overly clinical. You should be warm, responsive, and incredibly natural.
- Keep your turns conversational and interactive. Avoid long monolithic paragraphs unless explaining service features deeply, but even then, break it up with pleasant conversational buffers.

Business Flow Policy:
1. Always establish rapport: Speak naturally and make them feel understood. First ask for their preferred language if they start in an unexpected voice or show split choices.
2. Politely get their name early so you can address them personalized.
3. Discover their business needs: S-Call Hub builds the world's most advanced, ultra-fast 24/7 AI voice agents and automation platform to book appointments, qualify leads, and handle inbound/outbound support 24/7. We integrate with leading systems (like Vapi AI, Retell AI, Omni Dimension, and Gemini API) to create human-sounding reps.
4. Explain how AI receptionists, booking agents, lead compilers or customer support can save them thousands of dollars and ensure they never miss a single customer call.
5. If they seem interested, help book a consultation or appointment. If a customer agrees to schedule an appointment, meeting, or booking, call the "book_calendar_appointment" tool instantly.

Language Rules:
- If the customer speaks to you in Hindi (or Hinglish), respond fluently in natural Hindi (or Hinglish) with complete conversational warmth.
- If the customer speaks English, respond in natural, warm English. Keep the conversation extremely human.`;

  const demos = [
    {
      id: "receptionist",
      title: "24/7 Multilingual AI Receptionist",
      desc: "Books appointments, answers FAQs, asks language and customer name.",
      preset: `${BASE_PROMPT}

Your specific role: You are an AI Receptionist.
Features to handle:
- asks language
- asks customer name
- books appointments
- answers FAQs`,
      type: "voice"
    },
    {
      id: "realestate",
      title: "AI Property Sales Agent",
      desc: "Property inquiry, budget discussion, site visit booking.",
      preset: `${BASE_PROMPT}

Your specific role: You are an AI Property Sales Agent (Real Estate AI Caller).
Features to handle:
- property inquiry
- budget discussion
- site visit booking`,
      type: "voice"
    },
    {
      id: "medical",
      title: "AI Medical Booking Assistant",
      desc: "Doctor appointment booking, multilingual support, patient intake.",
      preset: `${BASE_PROMPT}

Your specific role: You are an AI Medical Booking Assistant (Clinic Appointment Agent).
Features to handle:
- doctor appointment booking
- multilingual support
- patient intake`,
      type: "voice"
    },
    {
      id: "restaurant",
      title: "AI Restaurant Booking Agent",
      desc: "Table booking, timing inquiry, customer handling.",
      preset: `${BASE_PROMPT}

Your specific role: You are an AI Restaurant Booking Agent.
Features to handle:
- table booking
- timing inquiry
- customer handling`,
      type: "voice"
    },
    {
      id: "agency",
      title: "AI Lead Qualification Agent",
      desc: "Asks about business, identifies needs, explains services, books consultation.",
      preset: `${BASE_PROMPT}

Your specific role: You are an AI Lead Qualification Agent for S-Call Hub (Website Agency Sales Agent).
Features to handle:
- asks about business
- identifies needs
- explains services
- books consultation`,
      type: "voice"
    }
  ];

  const callVolumeData = [
    { name: 'Mon', Receptionist: 400, Sales: 240, Medical: 200, Restaurant: 300, Agency: 120 },
    { name: 'Tue', Receptionist: 300, Sales: 139, Medical: 221, Restaurant: 400, Agency: 180 },
    { name: 'Wed', Receptionist: 200, Sales: 980, Medical: 229, Restaurant: 350, Agency: 150 },
    { name: 'Thu', Receptionist: 278, Sales: 390, Medical: 200, Restaurant: 280, Agency: 200 },
    { name: 'Fri', Receptionist: 189, Sales: 480, Medical: 218, Restaurant: 420, Agency: 250 },
    { name: 'Sat', Receptionist: 239, Sales: 380, Medical: 250, Restaurant: 500, Agency: 100 },
    { name: 'Sun', Receptionist: 349, Sales: 430, Medical: 210, Restaurant: 480, Agency: 90 },
  ];

  const conversionData = [
    { name: 'Receptionist', rate: 45 },
    { name: 'Property', rate: 32 },
    { name: 'Medical', rate: 68 },
    { name: 'Restaurant', rate: 75 },
    { name: 'Agency', rate: 28 },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-s-black px-6">
      <div className="max-w-7xl mx-auto">
        {!activeDemo ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Interactive <span className="gradient-text">AI Demos</span></h1>
              <p className="text-s-gray-400 max-w-2xl mx-auto">Experience next-generation conversational AI in both Voice and Text modes.</p>
            </div>

            {/* Grid for Quick Actions & Testing */}
            <div className="max-w-7xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Free Real Call Demo Callout Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setIsBookModalOpen(true)}
                className="lg:col-span-7 cursor-pointer relative group overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-8 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs text-emerald-400 font-semibold mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      <span>Free Live Call Dialer</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">Want a real call demo for free?</h3>
                    <p className="text-sm text-s-gray-400">
                      Experience how our ultra-fast AI voice agents sound on an actual phone line! Tap here to book a quick callback and we'll dial your phone in real time.
                    </p>
                  </div>
                  <div className="w-full mt-4 text-left">
                    <div className="inline-flex items-center justify-center bg-white text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] group-hover:scale-[1.02]">
                      <span>Request Free Real Call</span>
                      <span className="ml-2">📞</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Hardware / Mic Test Widget */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="lg:col-span-5 flex flex-col h-full justify-stretch"
              >
                <MicTestWidget />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
              {demos.map((demo, idx) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 cursor-pointer hover:border-white/30 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  onClick={() => setActiveDemo(demo)}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl pointer-events-none group-hover:scale-110 transition-transform">
                    {demo.type === 'voice' ? <Mic size={80} /> : <MessageSquare size={80} />}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs uppercase tracking-wider text-green-500 font-semibold">{demo.type === 'voice' ? 'Voice Agent' : 'Text Agent'}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-bold mb-2">{demo.title}</h3>
                  <p className="text-s-gray-400 text-sm mb-6 h-10">{demo.desc}</p>
                  
                  <button className="glass-button w-full py-2 text-sm flex items-center justify-center space-x-2 relative z-10">
                    {demo.type === 'voice' ? <Mic size={16} /> : <MessageSquare size={16} />}
                    <span>Start {demo.type === 'voice' ? 'Call' : 'Chat'}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <LiveChatInterface demo={activeDemo} onBack={() => setActiveDemo(null)} onOpenBookCall={() => setIsBookModalOpen(true)} />
        )}
      </div>
      <BookCallModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
    </div>
  );
}

function LiveChatInterface({ demo, onBack, onOpenBookCall }: { demo: any, onBack: () => void, onOpenBookCall: () => void }) {
  const { googleAccessToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem(`demo_${demo.id}_chat`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved chat history', e);
      }
    }
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem(`demo_${demo.id}_chat`, JSON.stringify(messages));
  }, [messages, demo.id]);

  const [interactionMode, setInteractionMode] = useState<'voice' | 'text'>('voice');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // If conversation is empty, AI starts the call
    if (messages.length === 0 && !isTyping) {
      const startConversation = async () => {
        setIsTyping(true);
        try {
          const res = await fetch('/api/gemini-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: "Start the conversation now.",
              systemInstruction: demo.preset,
              googleAccessToken
            })
          });
          const data = await res.json();
          const aiResponseText = data.text || "Hello! How can I help you today?";
          setMessages([{ role: 'ai', text: aiResponseText }]);
          if (interactionMode === 'voice') {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(aiResponseText);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            synth.speak(utterance);
          }
        } catch (err) {
          console.error('Initial Chat API Error:', err);
          setMessages([{ role: 'ai', text: "I'm having trouble connecting to the AI services right now. Please ensure the backend is running and the Gemini API key is configured correctly." }]);
        } finally {
          setIsTyping(false);
        }
      };
      startConversation();
    }
  }, [demo.id, demo.preset, interactionMode]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (interactionMode !== 'voice') return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  const handleModeChange = (mode: 'voice' | 'text') => {
    if (mode === 'text') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (isListening) {
        try {
          recognitionRef.current?.stop();
        } catch (e) {}
        setIsListening(false);
      }
    }
    setInteractionMode(mode);
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;
    
    setInput('');
    setMessages(p => [...p, { role: 'user', text: textToSend }]);
    setIsTyping(true);
    
    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          systemInstruction: demo.preset,
          googleAccessToken
        })
      });
      const data = await res.json();
      const aiResponseText = data.text || "Sorry, I couldn't process that.";
      setMessages(p => [...p, { role: 'ai', text: aiResponseText }]);
      speakText(aiResponseText);
    } catch (err) {
      console.error('Chat API Error:', err);
      setMessages(p => [...p, { role: 'ai', text: "I'm having trouble connecting to the AI services right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <button onClick={() => {
        window.speechSynthesis.cancel();
        onBack();
      }} className="text-s-gray-400 hover:text-white text-sm tracking-wide mb-6 flex items-center">
        ← Back to Demos
      </button>

      <div className="glass-panel overflow-hidden border border-white/10 flex flex-col h-[82vh] min-h-[480px] max-h-[750px] md:h-[70vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-lg">{demo.title}</h2>
            <div className="flex items-center space-x-3 text-xs mt-1">
              <span className="flex items-center text-green-500"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"/> Active</span>
              <span className="text-s-gray-500 uppercase tracking-widest">{interactionMode} MODE</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mode Switcher Pill */}
            <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 space-x-1">
              <button
                type="button"
                onClick={() => handleModeChange('voice')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all ${
                  interactionMode === 'voice'
                    ? 'bg-white text-black shadow-md'
                    : 'text-s-gray-400 hover:text-white'
                }`}
              >
                <Mic size={12} />
                <span>Voice Call</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('text')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all ${
                  interactionMode === 'text'
                    ? 'bg-white text-black shadow-md'
                    : 'text-s-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare size={12} />
                <span>Text Chat</span>
              </button>
            </div>

            {/* Animated Waveform for Voice */}
            {interactionMode === 'voice' && (
              <div className="flex items-center space-x-3">
                <div className="flex items-end space-x-0.5 h-6">
                  {[1,2,3,4,5].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: (isListening || isSpeaking) ? [4, Math.random() * 16 + 4, 4] : 3 }}
                      transition={{ repeat: (isListening || isSpeaking) ? Infinity : 0, duration: 0.5, delay: i * 0.1 }}
                      className={`w-0.5 rounded-full ${isSpeaking ? 'bg-green-400' : isListening ? 'bg-blue-400' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Free Real Call Demo Callout Banner */}
        <div 
          onClick={onOpenBookCall}
          className="bg-emerald-500/10 border-b border-emerald-500/20 py-3 px-6 text-center cursor-pointer hover:bg-emerald-500/15 transition-all text-xs text-emerald-400 flex items-center justify-center space-x-2 group relative z-20"
        >
          <span className="text-sm shrink-0">📞</span>
          <span className="font-medium">
            Want to try a real phone call with an agent? <span className="underline font-bold text-white group-hover:text-emerald-300">Tap here to book a call for free →</span>
          </span>
        </div>

        {/* Main Area */}
        {interactionMode === 'voice' ? (
          <div className="flex-grow flex flex-col items-center justify-between py-4 sm:py-6 bg-s-black/30 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
            
            {messages.length === 0 && isTyping ? (
              <div id="voice-handshake-skeleton" className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 my-auto">
                <div className="relative mb-6 sm:mb-8">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.25, 1],
                      opacity: [0.15, 0.45, 0.15] 
                    }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute -inset-10 rounded-full blur-2xl bg-white/20"
                  />
                  
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} className="absolute inset-0 rounded-full border border-white/20" />
                  <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.4, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-white/5 border border-white/10" />

                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl">
                    <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-white/40 animate-pulse" />
                  </div>
                </div>

                <div className="w-full text-center space-y-3">
                  <div className="h-4 bg-white/15 rounded-full w-2/3 mx-auto animate-pulse" />
                  <div className="h-3 bg-white/5 rounded-full w-1/2 mx-auto animate-pulse" />
                  
                  <div className="pt-4 flex flex-col items-center space-y-2 mt-2">
                    <span className="text-[10px] sm:text-xs text-s-gray-400 font-mono tracking-widest animate-pulse">ESTABLISHING AI VOX HANDSHAKE...</span>
                    
                    <div className="flex items-center space-x-1.5 h-3 mt-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 12, 4] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                          className="w-0.5 rounded-full bg-white/30"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id="voice-active-state" className="relative z-10 flex flex-col items-center flex-grow justify-center py-2 w-full">
                <div className="relative mb-6 sm:mb-8">
                  {/* Subtle ambient glow behind the avatar */}
                  <motion.div 
                    animate={{ 
                      scale: isSpeaking ? [1, 1.2, 1] : isListening ? [1, 1.05, 1] : 1,
                      opacity: isSpeaking ? [0.4, 0.6, 0.4] : isListening ? [0.2, 0.3, 0.2] : 0.1 
                    }} 
                    transition={{ repeat: Infinity, duration: isSpeaking ? 1.5 : 3, ease: "easeInOut" }}
                    className={`absolute -inset-10 rounded-full blur-2xl ${isSpeaking ? 'bg-white/30' : isListening ? 'bg-blue-500/20' : 'bg-transparent'}`}
                  />
                  
                  {isSpeaking && (
                    <>
                      <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} className="absolute inset-0 rounded-full border border-white/30" />
                      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3, ease: "easeOut" }} className="absolute inset-0 rounded-full bg-white/10" />
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "easeOut" }} className="absolute inset-0 rounded-full bg-white/20" />
                    </>
                  )}
                  {isListening && (
                    <>
                      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="absolute inset-0 rounded-full border border-blue-400/30" />
                      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-blue-500/20" />
                    </>
                  )}
                  <motion.div 
                    animate={{ scale: isSpeaking ? [1, 0.95, 1] : isListening ? [1, 0.98, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: isSpeaking ? 1.5 : 3, ease: "easeInOut" }}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl"
                  >
                    <Bot className={`w-10 h-10 sm:w-12 sm:h-12 ${isSpeaking ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : isListening ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-s-gray-500'}`} />
                  </motion.div>
                </div>
                
                <WaveformVisualizer isListening={isListening} isSpeaking={isSpeaking} />
                
                <p className="text-xs sm:text-sm font-medium tracking-wide text-s-gray-300 h-6">
                  {isSpeaking ? 'Agent is speaking...' : isListening ? 'Listening to you...' : 'Tap the microphone to speak'}
                </p>
                
                <div className="text-xs text-s-gray-300 mt-2 max-w-[94%] sm:max-w-[480px] text-center overflow-y-auto max-h-[100px] sm:max-h-[140px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl leading-relaxed font-sans scrollbar-thin">
                  {messages.length > 0 ? messages[messages.length - 1].text : "Hi there! Wake me up by clicking the microphone below."}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-6 relative z-50 mt-auto pb-4 pt-2">
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  if(isListening) toggleListening();
                  onBack();
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center text-red-500 transition-all hover:scale-105"
                title="End Call"
              >
                <PhoneOff size={24} />
              </button>
              
              <button 
                onClick={toggleListening}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${isListening ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600 text-white' : 'bg-white text-black shadow-white/20 hover:scale-105 border-4 border-white/10'}`}
              >
                {isListening ? <Square size={28} /> : <Mic size={28} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && isTyping ? (
              <div id="text-handshake-skeleton" className="space-y-6 animate-pulse">
                {/* AI Persona visual identification */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-white/15" />
                  <div className="space-y-1.5">
                    <div className="w-28 h-4 bg-white/15 rounded" />
                    <div className="w-16 h-2.5 bg-white/5 rounded" />
                  </div>
                </div>

                {/* Shimmering welcome bubble 1 */}
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-tl-none p-5 max-w-[80%] w-[330px] space-y-3 border border-white/5">
                    <div className="h-3.5 bg-white/15 rounded w-full" />
                    <div className="h-3.5 bg-white/15 rounded w-5/6" />
                    <div className="h-3.5 bg-white/10 rounded w-1/2" />
                  </div>
                </div>

                {/* Shimmering welcome bubble 2 */}
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[70%] w-[220px] space-y-2 border border-white/5">
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                  </div>
                </div>

                {/* Connection State text */}
                <div className="text-center py-6 text-xs text-s-gray-500 font-mono tracking-widest flex items-center justify-center space-x-2">
                  <Loader2 size={13} className="animate-spin text-white/30" />
                  <span>NEGOTIATING HANDSHAKE PAYLOAD...</span>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                    {msg.role === 'ai' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-a:text-s-gray-300 prose-a:underline hover:prose-a:text-white prose-p:my-0 prose-p:leading-relaxed">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-5 py-4 flex items-center space-x-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        {/* Input Area (Text Mode Only) */}
        {interactionMode === 'text' && (
          <div className="p-4 border-t border-white/5 bg-s-black/50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus-ring"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="absolute right-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-s-gray-400 hover:text-white disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
