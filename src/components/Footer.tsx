import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { SOCIALS, TICKETS_URL } from '../constants';
import Logo from './Logo';
import ETGLogo from './ETGLogo';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#050507] text-white overflow-hidden">
      {/* Top border */}
      <div className="h-px bg-white/8" />

      {/* Main footer content */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-16 pt-16 md:pt-24 pb-8">

        {/* Top section — Logo + Tagline + Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-16 md:mb-24">
          {/* Left: Logo + tagline */}
          <div className="space-y-6">
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <Logo variant="tedx" theme="dark" className="scale-75 md:scale-90 origin-left" />
            </Link>
            <p className="font-editorial text-xl md:text-2xl italic text-white/40 max-w-md leading-relaxed">
              Ideas worth holding onto.
            </p>
          </div>

          {/* Right: Newsletter signup */}
          <div className="w-full lg:w-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: LUXURY_EASE }}
              className="font-title text-2xl md:text-3xl font-black uppercase tracking-tighter mb-6"
            >
              Join our community
            </motion.p>
            {subscribed ? (
              <p className="font-editorial text-sm italic text-brand-secondary">
                Thanks for joining. We'll be in touch.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 bg-transparent border-b border-white/20 pb-3 font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  className="pb-3 text-white/40 hover:text-white transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
            <p className="mt-3 font-sans text-[9px] text-white/20">
              By submitting your email you agree to our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Middle section — Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16 md:mb-24">
          {/* Navigation */}
          <div className="space-y-5">
            <h4 className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/25">Navigation</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Theme', to: '/theme' },
                { label: 'Speakers', to: '/speakers' },
                { label: 'Agenda', to: '/agenda' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={scrollToTop}
                  className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* More links */}
          <div className="space-y-5">
            <h4 className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/25">&nbsp;</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'FAQ', to: '/faq' },
                { label: 'About', to: '/about' },
                { label: 'The Team', to: '/team' },
                { label: 'Tickets', to: TICKETS_URL, external: true },
              ].map((link) => (
                link.external ? (
                  <a
                    key={link.label}
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-300 inline-flex items-center gap-1.5"
                  >
                    {link.label}
                    <ArrowUpRight size={10} className="opacity-40" />
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={scrollToTop}
                    className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/25">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${SOCIALS.email}`}
                className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-300"
              >
                {SOCIALS.email}
              </a>
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-300 inline-flex items-center gap-1.5"
              >
                Instagram
                <ArrowUpRight size={10} className="opacity-40" />
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-5">
            <h4 className="font-typewriter text-[9px] uppercase tracking-[0.4em] text-white/25">Location</h4>
            <div className="space-y-3">
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                Al Muntazir Nursery<br />
                UN Road, Upanga<br />
                Dar Es Salaam, Tanzania
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Al+Muntazir+Islamic+International+School+-+Nursery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans text-sm text-white/50 hover:text-white transition-colors duration-300"
              >
                Get Directions
                <ArrowUpRight size={10} className="opacity-40" />
              </a>
            </div>
          </div>
        </div>

        {/* ETG Logo — prominent */}
        <div className="flex justify-center mb-12 md:mb-16">
          <ETGLogo className="w-[120px] md:w-[160px] h-auto opacity-30 hover:opacity-60 transition-opacity duration-500" />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[9px] text-white/20 text-center md:text-left">
            This independent TEDx event is operated under license from TED. © 2026 TEDxAlMuntazirSchoolsYouth.
          </p>
          <p className="font-typewriter text-[8px] uppercase tracking-[0.3em] text-white/15">
            Dar Es Salaam, Tanzania
          </p>
        </div>
      </div>
    </footer>
  );
}
