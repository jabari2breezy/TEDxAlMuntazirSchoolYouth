import { motion } from 'motion/react';
import { ArrowUpRight, Ticket as TicketIcon } from 'lucide-react';
import TicketScrollytelling from '../components/TicketScrollytelling';
import { TICKETS_URL } from '../constants';

export default function Tickets() {
  return (
    <div className="bg-[#050507] text-white overflow-x-hidden">
      <TicketScrollytelling />

      <section className="relative z-20 border-t border-white/10 bg-[#050507] px-6 md:px-16 py-20 md:py-28">
        <div className="mx-auto max-w-screen-2xl grid gap-8 md:grid-cols-[0.75fr_1.25fr] items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
              <TicketIcon size={16} className="text-brand-secondary" />
              <span className="font-typewriter text-[9px] uppercase tracking-[0.45em] text-white/45">Ticket access</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-title font-black uppercase tracking-tighter leading-[0.82]">
              Secure your
              <span className="block text-brand-secondary italic font-editorial lowercase">entry now.</span>
            </h2>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-2xl">
            <p className="font-editorial text-lg md:text-2xl italic text-white/70 leading-relaxed">
              The ticket page is now centered around a single high-end 3D pass, scroll-linked motion, and a transaction layer that feels closer to a luxury product reveal than a plain checkout page.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.a
                href={TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-4 rounded-full bg-brand-secondary px-7 py-4 font-title text-lg font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_50px_rgba(0,109,56,0.35)]"
              >
                Buy ticket
                <ArrowUpRight size={18} />
              </motion.a>
              <span className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/35">
                Scroll-driven / 3D / editorial
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
