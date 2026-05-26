import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, PhoneCall, Settings, ArrowRight } from 'lucide-react';
import FadingVideo from '../components/FadingVideo';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const features = [
    {
      title: "AI Receptionist",
      desc: "Answers calls instantly, talks naturally, and handles customer conversations 24/7.",
      icon: <Bot className="w-8 h-8 text-white mb-4" />,
      tags: ["Human Voice", "Smart Replies", "Instant Pickup", "Multi Language"]
    },
    {
      title: "Outbound AI Calling",
      desc: "Automatically call leads, qualify customers, and book appointments at scale.",
      icon: <PhoneCall className="w-8 h-8 text-white mb-4" />,
      tags: ["Bulk Calling", "CRM Sync", "Lead Qualification", "Auto Follow-up"]
    },
    {
      title: "Custom AI Systems",
      desc: "Fully custom AI voice agents built for your business workflows.",
      icon: <Settings className="w-8 h-8 text-white mb-4" />,
      tags: ["Business Automation", "AI Analytics", "Real-Time Insights", "API Integrations"]
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] md:h-screen flex items-center border-b border-white/5">
        <FadingVideo />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center items-center text-center pt-28 pb-12 md:py-0 mt-20 md:mt-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
              <span className="text-xs tracking-widest uppercase text-white font-semibold">The Future of Automation</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
              AI Voice Agents That Handle Calls <span className="gradient-text">Like Real Humans</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-s-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Automate customer support, appointment booking, lead qualification, and outbound calling using ultra-fast AI voice agents powered by next-generation conversational AI.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/contact" className="glass-button px-8 py-4 text-base w-full sm:w-auto flex items-center justify-center">
                <span>Launch AI Agent</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/agents" className="px-8 py-4 text-base w-full sm:w-auto flex items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                <span>See Examples</span>
              </Link>
              <a href="#features" className="text-sm font-medium tracking-wide hover:text-white text-s-gray-400 transition-colors sm:ml-4">
                Explore Features
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-s-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Intelligent By Design</h2>
            <p className="text-s-gray-400 max-w-xl mx-auto">Our voice agents integrate seamlessly into your workflow to replace manual effort with autonomous excellence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-panel p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col items-start"
              >
                {feature.icon}
                <h3 className="text-2xl font-display font-semibold mb-3">{feature.title}</h3>
                <p className="text-s-gray-400 text-sm mb-6 leading-relaxed flex-grow">{feature.desc}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {feature.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10 rounded font-medium text-s-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
