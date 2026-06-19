import React from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, Heart, Star, ShieldCheck, Droplet, UserCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export default function DonorCertificate() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex flex-col items-center">
      
      {/* PREMIUM RED HEADER */}
      <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Award className="w-40 h-40 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Merit Achievement</h1>
              <p className="text-red-100/70 font-medium text-sm">Download your official bravery certificate for your heroic contributions.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button className="px-6 py-2.5 bg-white text-[#C0392B] text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2">
               <Download className="w-4 h-4" /> Download PDF
             </button>
          </div>
        </div>
      </div>

      {/* Certificate Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl aspect-[1.414/1] bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-[20px] border-white overflow-hidden p-1 flex flex-col items-center justify-center text-center mt-8 ring-1 ring-slate-100"
      >
        {/* Certificate Frame/Background */}
        <div className="absolute inset-0 border-[3px] border-double border-red-100 rounded-[2rem] m-6 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#C0392B]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#E74C3C]/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Content */}
        <div className="relative z-10 p-12 flex flex-col items-center">
           <div className="w-28 h-28 bg-[#C0392B] rounded-full flex items-center justify-center mb-10 shadow-2xl relative border-8 border-white">
              <Award className="text-white w-12 h-12" />
              <motion.div 
                animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset--2 rounded-full border-2 border-dashed border-red-200"
              />
           </div>

           <h2 className="text-[#0F172A] font-black text-4xl tracking-[0.25em] uppercase mb-4">Certificate of Merit</h2>
           <p className="text-slate-400 font-black tracking-[0.4em] text-xs uppercase mb-16 underline decoration-red-500 decoration-4 underline-offset-8">Dedicated to life-saving excellence</p>
           
           <h3 className="text-6xl font-black text-[#C0392B] mb-6 font-serif italic tracking-tight">{user?.name || 'A Valued Hero'}</h3>
           <div className="w-48 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-12" />
           
           <p className="text-slate-600 font-bold text-xl max-w-lg leading-relaxed">
             This certificate is proudly presented for your extraordinary bravery and commitment to humanity through blood donation.
           </p>

           <div className="mt-16 grid grid-cols-3 gap-16 w-full pt-12 border-t border-slate-100 items-end">
              <div className="space-y-1 text-left">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verification ID</p>
                 <p className="text-xs font-black text-[#0F172A]">BL-CERT-2026-HQ</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-inner">
                    <Droplet className="text-[#C0392B] w-8 h-8 fill-current" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Seal</p>
              </div>
              <div className="space-y-1 text-right">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Issuing Authority</p>
                 <p className="text-xs font-black text-[#0F172A]">BloodLink National HQ</p>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Badges Earned */}
      <div className="w-full max-w-5xl mt-20 pt-16 border-t-2 border-slate-50 pb-20">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Honor Badges</h2>
               <p className="text-slate-400 font-medium text-sm mt-1">Unlock new achievements by donating regularly.</p>
            </div>
            <button className="px-5 py-2.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-all">
               View Requirements
            </button>
         </div>

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { id: 1, name: 'First Hero', desc: '1st Donation', icon: Heart, color: 'text-red-500 bg-red-50 shadow-red-100' },
               { id: 2, name: 'Golden Drop', desc: '5 Units Total', icon: Award, color: 'text-blue-500 bg-blue-50 shadow-blue-100' },
               { id: 3, name: 'Life Guardian', desc: 'Save 15 Lives', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50 shadow-emerald-100' },
               { id: 4, name: 'Blood Link Elite', desc: 'Top Tier Donor', icon: Star, color: 'text-amber-500 bg-amber-50 shadow-amber-100' },
            ].map((badge) => (
               <div key={badge.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm text-center group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform ${badge.color}`}>
                     <badge.icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-black text-[#0F172A] text-lg tracking-tight leading-4">{badge.name}</h3>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">{badge.desc}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
