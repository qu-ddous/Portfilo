import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, Droplets, Users, Hospital, ArrowRight,
  CheckCircle, Search, MapPin, Activity, Phone
} from 'lucide-react';

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', duration = 2.5 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    return spring.on('change', (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Blood Type Card ─── */
const BLOOD_TYPES = [
  { type: 'A+',  units: 42, status: 'sufficient', color: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20' },
  { type: 'A-',  units: 3,  status: 'critical',   color: 'from-rose-500   to-rose-700   shadow-rose-500/20' },
  { type: 'B+',  units: 28, status: 'sufficient', color: 'from-blue-400   to-blue-600   shadow-blue-500/20' },
  { type: 'B-',  units: 6,  status: 'low',        color: 'from-amber-400  to-amber-600  shadow-amber-500/20' },
  { type: 'AB+', units: 15, status: 'sufficient', color: 'from-purple-400 to-purple-600 shadow-purple-500/20' },
  { type: 'AB-', units: 2,  status: 'critical',   color: 'from-pink-500   to-pink-700   shadow-pink-500/20' },
  { type: 'O+',  units: 9,  status: 'low',        color: 'from-orange-400 to-orange-600 shadow-orange-500/20' },
  { type: 'O-',  units: 1,  status: 'critical',   color: 'from-red-600    to-red-800    shadow-red-500/20' },
];

const STATUS_CONFIG = {
  sufficient: { label: 'Sufficient', dot: 'bg-emerald-300' },
  low:        { label: 'Low Stock',  dot: 'bg-yellow-300' },
  critical:   { label: 'Critical',   dot: 'bg-white animate-pulse' },
};

export default function Landing() {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
       try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/stats`);
          const data = await res.json();
          setLiveStats(data);
       } catch (err) {
          console.error('Failed to fetch public stats');
       }
    };
    fetchStats();
  }, []);

  const displayBloodTypes = [
    { type: 'A+',  units: liveStats['A+']  || 0, color: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20' },
    { type: 'A-',  units: liveStats['A-']  || 0, color: 'from-rose-500   to-rose-700   shadow-rose-500/20' },
    { type: 'B+',  units: liveStats['B+']  || 0, color: 'from-blue-400   to-blue-600   shadow-blue-500/20' },
    { type: 'B-',  units: liveStats['B-']  || 0, color: 'from-amber-400  to-amber-600  shadow-amber-500/20' },
    { type: 'AB+', units: liveStats['AB+'] || 0, color: 'from-purple-400 to-purple-600 shadow-purple-500/20' },
    { type: 'AB-', units: liveStats['AB-'] || 0, color: 'from-pink-500   to-pink-700   shadow-pink-500/20' },
    { type: 'O+',  units: liveStats['O+']  || 0, color: 'from-orange-400 to-orange-600 shadow-orange-500/20' },
    { type: 'O-',  units: liveStats['O-']  || 0, color: 'from-red-600    to-red-800    shadow-red-500/20' },
  ].map(t => ({
    ...t,
    status: t.units > 20 ? 'sufficient' : t.units > 5 ? 'low' : 'critical'
  }));

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
  };

  return (
    <div className="overflow-x-hidden bg-[#F8F9FA] text-[#1E293B]">

      {/* ════════════════════════════════════════
          HERO SECTION (Premium Glassmorphism)
      ════════════════════════════════════════ */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden bg-[#0B1120]">
        
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" 
          />
          {/* Subtle Grid pattern overlay for tech feel */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYwIDBMMCAwaDB2NjBoNjBWMHptLTEgMTlIMTlwNDAoMHYtMXptMCAyMEgxOXY0MGgwdi0xem0tMjAgMjBWMHgtMXY2MGgxeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 backdrop-blur-sm text-rose-400 text-xs font-bold px-4 py-2 rounded-full mb-6 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
              >
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                Live Blood Requests Active
              </motion.div>

              <motion.h1
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-lg"
              >
                Donate Blood, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-500 to-rose-600">
                  Save Human Lives
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="text-base md:text-lg text-gray-300 mb-8 max-w-lg leading-relaxed font-medium"
              >
                Fast, reliable, and transparent. Connect instantly with local blood banks and donors. Your single donation can save up to 3 lives today.
              </motion.p>

              {/* Premium Hero Actions */}
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => navigate('/signup?role=donor')}
                  className="group relative flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <Heart className="w-4 h-4 fill-current relative z-10" />
                  <span className="relative z-10">Become a Donor</span>
                </button>

                <button
                  onClick={() => navigate('/signup?role=patient')}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 backdrop-blur-md text-white border border-white/10 text-sm font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Find Blood
                </button>
              </motion.div>
            </div>

            {/* Right Sleek Orbiting Visuals & Blood Drop */}
            <div className="hidden lg:flex relative z-10 w-full justify-center lg:justify-end items-center h-[450px]">
              <div className="relative w-[340px] h-[340px] mt-10 mr-10 xl:mr-16">
                
                {/* Orbital Paths */}
                <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                <div className="absolute inset-12 border border-white/5 rounded-full border-dashed" />

                {/* Donor (Top Source Point) & Falling Blood Drop */}
                <div className="absolute -top-20 left-1/2 -ml-[45px] flex flex-col items-center justify-center z-30 w-[90px]">
                  <div className="w-20 h-20 bg-[#1E293B] border-2 border-rose-500/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] relative">
                    <Users className="w-8 h-8 text-rose-400" />
                    <span className="text-[8px] font-bold text-rose-200 mt-1 uppercase tracking-widest bg-rose-500/20 px-2 py-0.5 rounded-full">Donor</span>
                  </div>

                  {/* The continuous flowing blood drop from Donor to Hub */}
                  <div className="absolute top-[80px] h-[160px] w-[2px] bg-gradient-to-b from-rose-500/50 to-transparent flex justify-center overflow-hidden">
                     <motion.div
                       animate={{ y: [-10, 160], opacity: [0, 1, 1, 0], scale: [0.7, 1.2, 1, 0.5] }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn" }}
                       className="absolute top-0 text-rose-500"
                     >
                       <Droplets className="w-8 h-8 fill-current drop-shadow-[0_5px_15px_rgba(225,29,72,0.9)] opacity-90" />
                     </motion.div>
                  </div>
                </div>

                {/* Orbiting Blood Types */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 z-20">
                  {[
                    { type: 'A+',  color: 'from-blue-400 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]',     pos: 'top-0 left-1/2 -ml-8 -mt-8' },
                    { type: 'O-',  color: 'from-rose-500 to-red-600 shadow-[0_0_20px_rgba(225,29,72,0.5)]',       pos: 'bottom-0 left-1/2 -ml-8 -mb-8' },
                    { type: 'B+',  color: 'from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.5)]',pos: 'top-1/2 left-0 -ml-8 -mt-8' },
                    { type: 'AB-', color: 'from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]',    pos: 'top-1/2 right-0 -mr-8 -mt-8' }
                  ].map((item) => (
                    <div key={item.type} className={`absolute ${item.pos}`}>
                      <motion.div 
                        animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} 
                        className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex flex-col items-center justify-center text-white border-2 border-white/20`}
                      >
                        <span className="font-black text-xl">{item.type}</span>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>

                {/* Core Blood Bank Hub */}
                <div className="absolute top-1/2 left-1/2 w-[160px] h-[160px] -ml-[80px] -mt-[80px] bg-[#0F172A]/90 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.8)] z-10 overflow-hidden">
                  {/* Glowing Pulse Rings */}
                  <motion.div animate={{ scale: [0.8, 1.5], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 border-2 border-rose-500/50 rounded-full" />
                  
                  {/* Stable Inner Core */}
                  <div className="relative w-[100px] h-[100px] bg-gradient-to-br from-rose-600 to-red-800 rounded-full shadow-[0_0_30px_rgba(225,29,72,0.8)] border border-rose-400/50 flex flex-col items-center justify-center">
                    <Hospital className="w-8 h-8 text-white mb-1" />
                    <span className="text-[10px] text-rose-100 font-bold uppercase tracking-widest text-center leading-none">Blood<br/>Hub</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          OVERLAPPING STATS BAR (Sleek Glass Look)
      ════════════════════════════════════════ */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-20">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-gray-100">
            {[
              { icon: Users,    label: 'Total Donors',    target: 12500, suffix: '+', color: 'text-blue-600',    bg: 'bg-blue-50' },
              { icon: Droplets, label: 'Units Available', target: 8320,  suffix: '',  color: 'text-rose-600',    bg: 'bg-rose-50' },
              { icon: Heart,    label: 'Lives Saved',     target: 34200, suffix: '+', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Hospital, label: 'Partner Banks',   target: 150,   suffix: '+', color: 'text-purple-600',  bg: 'bg-purple-50' },
            ].map(({ icon: Icon, label, target, suffix, color, bg }, i) => (
              <div key={label} className="p-2 group">
                <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-[#1E293B] mb-1 tracking-tight">
                  <AnimatedCounter target={target} suffix={suffix} />
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LIVE INVENTORY (Vibrant Grid + EKG Animation)
      ════════════════════════════════════════ */}
      <section className="py-10 relative overflow-hidden">
        {/* Animated Background EKG Line */}
        <div className="absolute top-10 right-0 opacity-10 pointer-events-none hidden lg:block">
          <svg viewBox="0 0 800 100" className="w-[800px] h-[100px] stroke-rose-500 stroke-[3px] fill-none drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" strokeLinecap="round" strokeLinejoin="round">
            <motion.path 
               initial={{ strokeDasharray: "1000", strokeDashoffset: "1000" }}
               animate={{ strokeDashoffset: "0" }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               d="M0 50 L300 50 L320 20 L350 90 L380 10 L410 70 L430 50 L800 50" 
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-widest bg-rose-50 px-4 py-1.5 rounded-full inline-flex items-center gap-2 relative shadow-[0_0_10px_rgba(244,63,94,0.1)]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Live Dashboard
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3 text-[#1E293B]">Real-Time Inventory</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Updated instantly across all partner hospitals. Critical types highlight our most urgent needs today.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {displayBloodTypes.map(({ type, units, status, color }, i) => {
              const cfg = STATUS_CONFIG[status];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  key={type}
                  className={`relative overflow-hidden bg-gradient-to-br ${color} rounded-3xl p-6 text-white shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all group`}
                >
                  <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-12 group-hover:rotate-0 duration-500">
                    <Droplets className="w-32 h-32 fill-current" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div className="flex justify-between items-start">
                      <div className="text-4xl font-black drop-shadow-sm">{type}</div>
                      <span className={`flex items-center justify-center shrink-0 w-2.5 h-2.5 rounded-full ${cfg.dot} shadow-md`} title={cfg.label} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold opacity-95">{units} <span className="text-xs font-semibold opacity-75 uppercase tracking-wide">units</span></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS (Elegant + Flowing Blood Line)
      ════════════════════════════════════════ */}
      <section className="py-20 mt-10 bg-white border-y border-gray-100 relative overflow-hidden">
        {/* Subtle mesh background for How It Works */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-80" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1E293B]">Save a Life in 3 Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Animated Dashed Connection Line with Moving Blood Drop */}
            <div className="hidden md:block absolute top-[40px] left-[16%] right-[16%] border-t-2 border-dashed border-gray-200 z-0">
               {/* Transporter Drop passing through the line */}
               <motion.div 
                 className="absolute -top-[7px]"
                 animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               >
                 <Droplets className="w-3 h-3 text-rose-500 fill-current -rotate-90 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]" />
               </motion.div>
            </div>

            {[
              { step: '1', icon: Users,    title: 'Register Free', desc: 'Create your account in 30 seconds.', bg: 'bg-blue-50 text-blue-600 ring-blue-100' },
              { step: '2', icon: Droplets, title: 'Visit & Donate',desc: 'Go to the nearest matched bank.', bg: 'bg-rose-50 text-rose-600 ring-rose-100' },
              { step: '3', icon: Heart,    title: 'Track Impact',  desc: 'See exactly who you helped.', bg: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
            ].map(({ step, icon: Icon, title, desc, bg }, i) => (
              <motion.div 
                key={step} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center bg-white p-6 rounded-3xl"
              >
                <div className={`w-20 h-20 ${bg} ring-8 rounded-2xl flex items-center justify-center mb-6 relative shadow-sm transition-transform hover:scale-105`}>
                  <Icon className="w-8 h-8" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#1E293B] shadow-lg text-white font-black rounded-full flex items-center justify-center text-sm border-2 border-white">
                    {step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1E293B]">{title}</h3>
                <p className="text-gray-500 text-sm text-center font-medium leading-relaxed max-w-[220px]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT SECTION
      ════════════════════════════════════════ */}
      <section id="about" className="py-20 bg-[#F8F9FA] relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-rose-600 font-bold text-xs uppercase tracking-widest bg-rose-50 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
              Our Mission & Team
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3 text-[#1E293B]">Who We Are</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
              BloodLink was founded with a simple belief: no patient should die because blood wasn't available. We built a platform that makes blood donation as easy as ordering food online — fast, trackable, and completely transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Dr. Ayesha Malik', role: 'Medical Director', initial: 'AM', color: 'from-rose-500 to-rose-600 shadow-rose-500/20' },
              { name: 'Hassan Raza',      role: 'Operations Head',  initial: 'HR', color: 'from-blue-500 to-blue-600 shadow-blue-500/20' },
              { name: 'Sana Qureshi',     role: 'Donor Relations',  initial: 'SQ', color: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20' },
              { name: 'Bilal Ahmed',      role: 'Tech Lead',        initial: 'BA', color: 'from-purple-500 to-purple-600 shadow-purple-500/20' },
            ].map(({ name, role, initial, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${color} text-white rounded-3xl p-6 text-center shadow-lg hover:-translate-y-1.5 hover:shadow-xl transition-all group`}
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner text-white text-xl font-black group-hover:scale-110 transition-transform">
                  {initial}
                </div>
                <h3 className="font-black text-base">{name}</h3>
                <p className="text-white/80 text-[11px] font-bold uppercase mt-1 tracking-wider">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONTACT SECTION
      ════════════════════════════════════════ */}
      <section id="contact" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1E293B]">Get in Touch</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto mt-3">Need help or want to partner with us? We're available 24/7.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Quick Contact Info */}
            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Headquarters', text: '123 Medical Center Dr, Lahore', bg: 'from-rose-500 to-rose-600 shadow-rose-500/20' },
                { icon: Phone,  title: 'Emergency Line', text: '+92 (51) 800-BLOODLINK', bg: 'from-blue-500 to-blue-600 shadow-blue-500/20' },
                { icon: Search, title: 'Email Support', text: 'info@bloodlink.org', bg: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20' }
              ].map(({ icon: Icon, title, text, bg }, i) => (
                <motion.div 
                  key={title}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-br ${bg} text-white shadow-lg hover:-translate-y-1 transition-transform group`}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-lg">{title}</p>
                    <p className="text-sm font-medium text-white/90 mt-0.5">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Simple Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-gray-50 rounded-3xl p-8 border border-gray-100"
            >
              <h3 className="font-black text-xl mb-6 text-[#1E293B]">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message Sent Successfully!"); }}>
                <input type="text" placeholder="Your Name" required className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all font-medium" />
                <input type="email" placeholder="Email Address" required className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all font-medium" />
                <textarea rows={3} placeholder="How can we help?" required className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all font-medium resize-none"></textarea>
                <button type="submit" className="w-full py-4 bg-[#1E293B] text-white font-bold rounded-xl hover:bg-[#0F172A] transition-all shadow-md active:scale-95 text-sm">
                  SendMessage
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BOTTOM CTA (Deep Mesh Gradient + Ripple Animation)
      ════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-[#0A0F1A]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-orange-600/20" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          {/* Animated Rippling Heart */}
          <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-rose-500 rounded-full" />
            <motion.div animate={{ scale: [1, 1.8], opacity: [0.8, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="absolute inset-0 bg-red-400 rounded-full" />
            <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.8)]">
              <Heart className="w-10 h-10 text-white fill-current" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">Be Someone's Hero Today</h2>
          <p className="text-base md:text-lg text-rose-100/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Every two seconds, someone needs blood. Your single donation can save multiple lives. Join our community of life-savers.
          </p>
          <button
            onClick={() => navigate('/signup?role=donor')}
            className="group px-10 py-4 bg-white text-rose-600 font-bold text-sm uppercase tracking-widest rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all flex items-center gap-3 mx-auto hover:-translate-y-1"
          >
            Start Saving Lives 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
}


