import React from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';

export default function Tickets() {
  return (
    <div className="min-h-screen bg-brand-background pt-32 pb-20 px-6 md:px-16 text-brand-primary flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-12"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-brand-secondary" />
            <span className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-brand-secondary">
              Ticketing
            </span>
            <div className="h-[1px] w-12 bg-brand-secondary" />
          </div>

          {/* Main Hero Text */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-title font-black uppercase tracking-tighter leading-[0.85]">
              Tickets
              <br />
              <span className="text-brand-secondary italic">Coming Soon</span>
            </h1>
            <p className="font-editorial text-xl md:text-2xl text-brand-primary/60 italic leading-relaxed max-w-xl mx-auto">
              We are partnering with <span className="not-italic font-bold text-brand-primary">Tukiio</span> to bring you a seamless ticketing experience. Secure your seat when we go live.
            </p>
          </div>

          {/* Clock Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-brand-surface border border-brand-outline rounded-[2rem] p-10 md:p-16 space-y-8 relative overflow-hidden"
          >
            {/* Decorative large number */}
            <span className="absolute top-6 right-8 text-[10rem] font-title font-black opacity-[0.03] leading-none select-none pointer-events-none">
              14
            </span>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                <Clock size={20} className="text-brand-secondary" />
              </div>
              <div>
                <p className="font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/40">Event Date</p>
                <p className="font-title font-black text-2xl uppercase tracking-tight">June 14, 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {[
                { label: 'General Admission', price: 'TZS 30,000', desc: 'Full day access + Lunch' },
                { label: 'Student Rate', price: 'Students Only', desc: 'All talks & activities' },
                { label: 'Location', price: 'Al Muntazir', desc: 'Dar es Salaam' },
              ].map(item => (
                <div key={item.label} className="bg-brand-background/50 rounded-xl p-5 border border-brand-outline">
                  <p className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40 mb-1">{item.label}</p>
                  <p className="font-title font-bold text-lg leading-tight">{item.price}</p>
                  <p className="font-editorial text-sm text-brand-primary/50 italic mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-brand-outline flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="font-typewriter text-[10px] uppercase tracking-widest text-brand-primary/40 text-center sm:text-left">
                Powered by Tukiio — Link dropping soon
              </p>
              <div className="flex items-center gap-2 px-6 py-3 bg-brand-primary/5 border border-brand-outline rounded-full text-brand-primary/40 font-typewriter text-[10px] uppercase tracking-widest cursor-not-allowed select-none">
                Get Tickets <ArrowRight size={12} className="ml-1" />
              </div>
            </div>
          </motion.div>

          {/* Notify strip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-brand-primary/30"
          >
            Follow our socials to be notified the moment tickets go live.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
