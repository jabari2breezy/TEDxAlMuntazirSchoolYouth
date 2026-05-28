import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SOCIALS, TICKETS_URL } from '../constants';
import Logo from './Logo';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
};

const linkHover = { scale: 1.02, x: 4, color: '#006d38', transition: { duration: 0.2 } };

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="px-6 md:px-16 py-32 border-t border-brand-outline relative overflow-hidden bg-brand-surface/40 backdrop-blur-md"
    >
      <div className="absolute inset-0 liquid-bg opacity-5 -z-10" />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20 relative z-10"
      >
        <motion.div variants={staggerItem} className="flex-1 space-y-12">
          <div className="flex flex-col gap-6">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link to="/" className="inline-block" onClick={scrollToTop}>
                <Logo variant="tedx" theme="light" className="scale-90 md:scale-110 origin-left" />
              </Link>
            </motion.div>
            <div className="w-16 h-[1px] bg-brand-primary/10" />
            <Logo variant="school" theme="light" className="scale-100 origin-left opacity-60 hover:opacity-100 transition-opacity" />
          </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-editorial text-4xl md:text-5xl leading-tight max-w-lg italic text-brand-primary"
            >
              "Ideas are the <span className="text-brand-secondary font-title not-italic uppercase">legacy</span> that survives the curated time."
            </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
          <motion.div variants={staggerItem} className="space-y-8">
            <h4 className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-primary/40">Explore</h4>
            <div className="flex flex-col gap-4 font-title text-xl uppercase tracking-tighter text-brand-primary">
              {[
                { label: 'Home', to: '/' },
                { label: 'Theme', to: '/theme' },
                { label: 'Speakers', to: '/speakers' },
                { label: 'Agenda', to: '/agenda' },
                { label: 'FAQs', to: '/faq' },
                { label: 'About', to: '/about' },
                { label: 'The Team', to: '/team' },
                { label: 'Tickets', to: TICKETS_URL, external: true },
              ].map((link) => (
                link.external ? (
                  <motion.a
                    key={link.label}
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={linkHover}
                    className="w-fit hover:text-brand-secondary transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ) : (
                  <motion.div key={link.label} whileHover={linkHover} className="w-fit" style={{ transformOrigin: 'left' }}>
                    <Link to={link.to} className="hover:text-brand-secondary transition-colors">
                      {link.label}
                    </Link>
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-8">
            <h4 className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-primary/40">Connect</h4>
            <div className="flex flex-col gap-4 font-title text-xl uppercase tracking-tighter text-brand-primary">
              <motion.a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={linkHover}
                className="flex items-center gap-3 hover:text-brand-secondary transition-colors group"
              >
                Instagram <ArrowUpRight size={16} className="opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
              <motion.a
                href={`mailto:${SOCIALS.email}`}
                whileHover={linkHover}
                className="flex items-center gap-3 hover:text-brand-secondary transition-colors group"
              >
                Contact <ArrowUpRight size={16} className="opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-8">
            <h4 className="font-typewriter text-[10px] uppercase tracking-[0.4em] text-brand-primary/40">Location</h4>
            <div className="space-y-6">
              <div className="font-title text-xl uppercase tracking-tighter text-brand-primary leading-tight">
                AlMuntazir Nursery,<br />
                UN Road, Upanga
              </div>
              <motion.a
                href="https://www.google.com/maps/search/?api=1&query=Al+Muntazir+Islamic+International+School+-+Nursery"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-6 py-3 border border-brand-outline rounded-full font-typewriter text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all group"
              >
                Get Directions <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-screen-2xl mx-auto pt-32 flex flex-col md:flex-row justify-between items-end gap-12 opacity-40"
      >
        <p className="font-sans text-[9px] uppercase tracking-widest leading-relaxed max-w-sm">
          This independent TEDx event is operated under license from TED. <br /><br />
          © 2026 TEDxAlMuntazirSchoolsYouth.
        </p>
        <div className="font-typewriter text-[9px] uppercase tracking-[0.4em]">
          Dar Es Salaam, Tanzania
        </div>
      </motion.div>
    </motion.footer>
  );
}
