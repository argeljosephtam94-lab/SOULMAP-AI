import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Map, 
  ChevronRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Briefcase, 
  CircleDollarSign, 
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Star,
  Lock,
  Loader2,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { BirthData, SoulMapInsights } from './types';
import { generateSoulMap } from './services/gemini';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from './lib/utils';

// --- Shared Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }) => {
  const variants = {
    primary: 'bg-nebula-500 hover:bg-nebula-400 text-white shadow-nebula-500/20 shadow-lg',
    secondary: 'bg-white text-celestial-950 hover:bg-slate-100',
    outline: 'border border-white/20 hover:bg-white/5 text-white'
  };

  return (
    <button 
      className={cn(
        'px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// --- SoulMap Sections ---

const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-nebula-400 text-sm font-medium">
        <Sparkles size={16} />
        <span>Experience the future of self-discovery</span>
      </div>
      <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight">
        Decode Your Life <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebula-400 to-blue-400">Blueprint</span> in 60s
      </h1>
      <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        Get AI-powered insights into your personality, relationships, career path, and hidden life patterns—based on your birth data.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={onStart} className="text-lg px-10 group">
          Generate My SoulMap <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-sm text-slate-500 flex items-center gap-2">
          No signup required • Takes less than 1 minute
        </p>
      </div>
    </motion.div>
  </section>
);

const Form = ({ onSubmit }: { onSubmit: (data: BirthData) => void }) => {
  const [data, setData] = useState<BirthData>({
    birthDate: '',
    birthLocation: '',
    focusArea: 'Life direction'
  });

  return (
    <section className="min-h-screen py-20 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass p-8 md:p-12 rounded-3xl"
      >
        <h2 className="text-3xl font-bold mb-2">Let’s build your SoulMap</h2>
        <p className="text-slate-400 mb-10">Answer a few quick questions so we can generate your personalized life insights.</p>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Calendar size={16} /> Birth Date
              </label>
              <input 
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-nebula-500 transition-colors"
                value={data.birthDate}
                onChange={e => setData({...data, birthDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Clock size={16} /> Birth Time (Optional)
              </label>
              <input 
                type="time" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-nebula-500 transition-colors"
                value={data.birthTime}
                onChange={e => setData({...data, birthTime: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <MapPin size={16} /> Birth Location
            </label>
            <input 
              type="text" 
              placeholder="City, Country"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-nebula-500 transition-colors"
              value={data.birthLocation}
              onChange={e => setData({...data, birthLocation: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-400">What do you want clarity on?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'Love', icon: Heart },
                { id: 'Career', icon: Briefcase },
                { id: 'Money', icon: CircleDollarSign },
                { id: 'Life direction', icon: Compass },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setData({...data, focusArea: item.id as any})}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                    data.focusArea === item.id 
                      ? "bg-nebula-500/20 border-nebula-500 text-white" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  )}
                >
                  <item.icon size={24} />
                  <span className="text-xs font-semibold">{item.id}</span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => onSubmit(data)}
            className="w-full py-5 text-xl mt-6 group"
            disabled={!data.birthDate || !data.birthLocation}
          >
            Start Analysis <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

const LoadingScreen = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Mapping personality traits...",
    "Calculating relationship dynamics...",
    "Identifying hidden strengths...",
    "Generating your life blueprint..."
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="relative mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-4 border-nebula-500/20 border-t-nebula-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="text-nebula-400" size={32} />
          </motion.div>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4">Analyzing Your Unique Pattern…</h2>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-nebula-400 font-mono"
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

const TrustSection = () => (
    <section className="py-24 px-4 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why thousands trust SoulMap AI</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our system combines pattern recognition, behavioral insights, and advanced AI modeling to generate deeply personalized reports.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { text: "“It felt like it understood me better than I do.”", author: "Sarah J." },
            { text: "“Scarily accurate about my relationships.”", author: "Marcus T." },
            { text: "“Helped me rethink my career path.”", author: "David L." }
          ].map((item, i) => (
            <div key={i} className="glass p-8 rounded-2xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-nebula-400 text-nebula-400" />)}
              </div>
              <p className="text-lg italic mb-6">"{item.text}"</p>
              <p className="font-bold text-nebula-400">— {item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
);

const FAQ = () => (
  <section className="py-24 px-4">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {[
          { q: "Is this astrology?", a: "It’s inspired by cosmic patterns but enhanced with AI-based personality modeling." },
          { q: "How accurate is it?", a: "Accuracy improves with complete birth data, especially birth time." },
          { q: "Do I need experience with astrology?", a: "No. Everything is explained in simple terms." }
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-2xl">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={18} className="text-nebula-400" /> {item.q}
            </h3>
            <p className="text-slate-400">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Main App Export ---

export default function App() {
  const [view, setView] = useState<'home' | 'form' | 'loading' | 'results' | 'dashboard'>('home');
  const [insights, setInsights] = useState<SoulMapInsights | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const startAnalysis = () => setView('form');
  
  const handleFormSubmit = async (data: BirthData) => {
    setBirthData(data);
    setView('loading');
    try {
      const res = await generateSoulMap(data);
      setInsights(res);
      setTimeout(() => setView('results'), 1000); // Small delay for effect
    } catch (err) {
      console.error(err);
      setView('home');
    }
  };

  const handleUnlock = () => {
    // In a real app, handle payment here
    setView('dashboard');
  };

  if (view === 'dashboard') {
    return <DailyMysticDashboard birthData={birthData!} onReset={() => setView('home')} />;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-nebula-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-transparent border-b-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-nebula-500 rounded-xl flex items-center justify-center font-bold text-xl glow-nebula italic">S</div>
            <span className="font-bold text-xl tracking-tight">SoulMap AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <Button onClick={() => setView('form')} variant="outline" className="px-6 py-2 text-xs">
                Launch App
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onStart={startAnalysis} />
              <HowItWorks />
              <EmotionalSection onStart={startAnalysis} />
              <TrustSection />
              <FAQ />
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Form onSubmit={handleFormSubmit} />
            </motion.div>
          )}

          {view === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingScreen />
            </motion.div>
          )}

          {view === 'results' && insights && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <ResultsPreview insights={insights} onUnlock={handleUnlock} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5 bg-celestial-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-nebula-500 rounded-lg flex items-center justify-center font-bold italic">S</div>
                <span className="font-bold text-lg">SoulMap AI</span>
            </div>
            <p className="text-slate-400 max-w-sm">Combining behavioral analysis and AI modeling to provide deep insights into your life patterns.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white">SoulMap Report</a></li>
              <li><a href="#" className="hover:text-white">Daily Guidance</a></li>
              <li><a href="#" className="hover:text-white">API access</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-slate-500 text-xs">
          © 2026 SoulMap AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// --- Subsections ---

const HowItWorks = () => (
  <section id="how" className="py-24 px-4 bg-white/[0.01]">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">How it works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { step: "Step 1", title: "Enter your birth details", desc: "Date, time, and location providing the baseline for your unique pattern.", icon: MapPin },
          { step: "Step 2", title: "AI analyzes your pattern", desc: "Advanced modeling cross-references personality frameworks with cosmic data.", icon: Zap },
          { step: "Step 3", title: "Receive your SoulMap", desc: "A comprehensive report detailing your path, strengths, and future trends.", icon: Sparkles },
        ].map((item, i) => (
          <div key={i} className="text-center group">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-nebula-500/20 group-hover:scale-110 transition-all border border-white/10">
              <item.icon className="text-nebula-400" />
            </div>
            <span className="text-xs font-bold text-nebula-500 uppercase tracking-widest block mb-2">{item.step}</span>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EmotionalSection = ({ onStart }: { onStart: () => void }) => (
  <section className="py-32 px-4">
    <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-nebula-500/10 blur-[100px]" />
      <h2 className="text-4xl md:text-5xl font-bold mb-8">Feeling stuck or uncertain?</h2>
      <p className="text-xl text-slate-300 mb-10 leading-relaxed">
        Most people repeat the same patterns in relationships, career, and life—without realizing it. <br className="hidden md:block" />
        SoulMap helps you see what’s been hidden so you can make better decisions moving forward.
      </p>
      <Button onClick={onStart} className="px-12 py-5 text-xl">
        Break My Patterns Now
      </Button>
    </div>
  </section>
);

const ResultsPreview = ({ insights, onUnlock }: { insights: SoulMapInsights, onUnlock: () => void }) => (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Here’s a glimpse of your SoulMap</h2>
        <p className="text-slate-400">Analysis completed. Reviewing core data points...</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="glass p-8 rounded-3xl space-y-8">
            <div>
                <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest mb-4">Identity Profile</h3>
                <div className="text-3xl font-bold mb-4">You are a “{insights.title}”</div>
                <div className="flex flex-wrap gap-2">
                    {insights.personalityTraits.map(t => (
                        <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium border border-white/10">{t}</span>
                    ))}
                </div>
            </div>

            <div className="h-64 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={insights.radarData}>
                        <PolarGrid stroke="#ffffff20" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Radar
                            name="SoulMap"
                            dataKey="A"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.5}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-8 relative">
            <div>
                <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest mb-2">Relationship Dynamics</h3>
                <p className="text-slate-300">{insights.relationshipDynamics}</p>
            </div>
            <div>
                <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest mb-2">Growth Catalyst</h3>
                <p className="text-slate-300 font-medium italic">{insights.growthPhase}</p>
            </div>

            {/* Blurred Section */}
            <div className="space-y-8 opacity-40 blur-sm pointer-events-none select-none">
                <div>
                    <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest mb-2">Career Alignment</h3>
                    <p className="text-slate-300">Detailed alignment with strategic industries...</p>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest mb-2">Shadow Aspects</h3>
                    <div className="space-y-1">
                        <p className="h-4 w-full bg-white/5 rounded" />
                        <p className="h-4 w-3/4 bg-white/5 rounded" />
                    </div>
                </div>
            </div>

            {/* Paywall Overlay */}
            <div className="absolute inset-0 bg-celestial-950/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center p-8 text-center">
                <div className="max-w-md">
                    <div className="w-16 h-16 bg-nebula-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-nebula-500/50">
                        <Lock className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Unlock Your Full SoulMap</h3>
                    <p className="text-slate-300 mb-8 text-sm">Your full report reveals complete personality profile, relationship patterns, career alignment, and future opportunities.</p>
                    <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
                        <div className="text-4xl font-bold mb-1">$19</div>
                        <div className="text-xs text-slate-400">One-time payment</div>
                    </div>
                    <Button onClick={onUnlock} className="w-full">Unlock My Full Report</Button>
                    <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div className="text-left">
                            <span className="text-[10px] text-slate-500 uppercase block mb-1">Add-on</span>
                            <div className="text-xs font-bold font-mono">+ 💞 Compatibility ($9)</div>
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] text-slate-500 uppercase block mb-1">Add-on</span>
                            <div className="text-xs font-bold font-mono">+ 💼 Career ($12)</div>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-6 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> 30-day money-back guarantee
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 blur-[2px] scale-95 origin-top p-12">
          {/* Simulated content just to show there's more */}
          <div className="h-40 glass rounded-3xl"></div>
          <div className="h-40 glass rounded-3xl"></div>
          <div className="h-40 glass rounded-3xl"></div>
      </div>
    </section>
);

const DailyMysticDashboard = ({ birthData, onReset }: { birthData: BirthData, onReset: () => void }) => {
    const [guidance, setGuidance] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetch = async () => {
            try {
                const res = await import('./services/gemini').then(m => m.generateDailyGuidance(birthData));
                setGuidance(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-celestial-950">
            <nav className="fixed top-0 inset-x-0 z-50 glass border-transparent border-b-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
                        <div className="w-8 h-8 bg-nebula-500 rounded-lg flex items-center justify-center font-bold italic">S</div>
                        <span className="font-bold text-lg">DailyMystic AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-mono px-3 py-1 bg-nebula-500/20 text-nebula-400 rounded-full border border-nebula-500/30">
                            PREMIUM ACTIVE
                        </div>
                        <button onClick={onReset} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Good morning.</h1>
                    <p className="text-slate-400">Here is your tailored guidance for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Tarot Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass p-8 rounded-3xl text-center group">
                            <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest mb-6">Daily Tarot Pull</h3>
                            <motion.div 
                                whileHover={{ scale: 1.05, rotateY: 180 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-48 h-72 bg-gradient-to-br from-nebula-600 to-celestial-900 mx-auto rounded-xl border-2 border-white/20 mb-8 flex items-center justify-center shadow-2xl relative overflow-hidden cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
                                <Sparkles size={48} className="text-white/40" />
                            </motion.div>
                            <h4 className="text-2xl font-bold mb-2">{guidance.tarot.card}</h4>
                            <p className="text-sm text-slate-400 italic mb-6">"{guidance.tarot.meaning}"</p>
                            <div className="p-4 bg-white/5 rounded-2xl text-left border border-white/5">
                                <p className="text-sm leading-relaxed text-slate-300">
                                    <span className="text-nebula-400 font-bold">AI Insight:</span> {guidance.tarot.aiAdvice}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Zodiac & Focus */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-3xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest">Zodiac Insight</h3>
                                    <div className="p-2 bg-nebula-500/20 rounded-lg text-nebula-400">
                                        <Star size={20} />
                                    </div>
                                </div>
                                <h4 className="text-2xl font-bold mb-4">{guidance.zodiacSign}</h4>
                                <p className="text-slate-300 leading-relaxed">{guidance.horoscope}</p>
                            </div>

                            <div className="glass p-8 rounded-3xl border-l-4 border-l-nebula-500">
                                <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest mb-6">Daily Strategic Advice</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Focus on</span>
                                        </div>
                                        <p className="text-slate-300 font-medium">{guidance.focusToday}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Avoid</span>
                                        </div>
                                        <p className="text-slate-300 font-medium">{guidance.avoidToday}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-3xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-nebula-400 uppercase tracking-widest">Upcoming Cycles</h3>
                                <Button variant="outline" className="px-4 py-2 text-xs">Full Weekly Forecast</Button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { day: 'Tuesday', trend: 'High communication potential', energy: 85 },
                                    { day: 'Wednesday', trend: 'Strategic rest required', energy: 40 },
                                    { day: 'Thursday', trend: 'Career advancement window', energy: 95 },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6">
                                        <div className="w-24 text-sm font-semibold">{item.day}</div>
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${item.energy}%` }}
                                                className="h-full bg-nebula-500"
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 hidden md:block">{item.trend}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

