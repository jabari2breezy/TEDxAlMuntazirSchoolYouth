import { motion, AnimatePresence, useScroll } from 'motion/react';
import { X, Sun, Moon, Slash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { SOCIALS, TICKETS_URL } from '../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState<{ text: string, author: string } | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const path = location.pathname;
    const forceDark = path === '/' || path === '/speakers' || path === '/tickets';
    
    if (forceDark) {
      document.documentElement.classList.remove('light');
    } else if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme, location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (isOpen) {
      fetch('/api/quote')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(setQuote)
        .catch(err => {
          console.warn('Quote fetch failed, using fallback:', err);
          setQuote({ text: "The clock was already running when you opened your eyes.", author: "Anonymous" });
        });
    }
  }, [isOpen]);

  const menuItems = [
    { name: 'Home', href: '/', id: '01', sub: 'The Beginning' },
    { name: 'Theme', href: '/theme', id: '02', sub: 'Borrowed Time' },
    { name: 'Speakers', href: '/speakers', id: '03', sub: 'Global Voices' },
    { name: 'FAQ', href: '/faq', id: '04', sub: 'The Answers' },
    { name: 'About', href: '/about', id: '05', sub: 'Our Philosophy' },
    { name: 'The Team', href: '/team', id: '06', sub: 'The Architects' },
    { name: 'Tickets', href: TICKETS_URL, id: '07', sub: 'Secure Your Seat' },
    { name: 'Sponsors', href: '/sponsors', id: '08', sub: 'Our Partners' },
  ];

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-secondary z-[200] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 flex justify-between items-center pointer-events-none mix-blend-difference text-white isolate"
      >
      <div className="flex items-center gap-6 pointer-events-auto">
        <Link to="/" className="flex items-baseline gap-4">
          <div id="nav-logo-tedx">
            <Logo variant="tedx" theme="dark" className="scale-75 md:scale-90 origin-left" />
          </div>
          <div className="hidden lg:block w-[1px] h-4 bg-white/30" />
          <Logo variant="school" theme="dark" className="hidden lg:block scale-75 origin-left opacity-80 hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* Navbar Pill - Desktop Centered */}
      <div className="hidden xl:flex items-center rounded-full p-1.5 border border-white/30 pointer-events-auto">
        {[
          { name: 'Home', href: '/' },
          { name: 'Theme', href: '/theme' },
          { name: 'Speakers', href: '/speakers' },
          { name: 'FAQ', href: '/faq' },
          { name: 'About', href: '/about' },
          { name: 'Team', href: '/team' },
          { name: 'Tickets', href: TICKETS_URL },
          { name: 'Sponsors', href: '/sponsors' },
        ].map((item) => (
          item.href.startsWith('http') ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-full text-[9px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 relative text-white/70 hover:text-white"
            >
              {item.name}
            </a>
          ) : (
            <Link 
              key={item.href}
              to={item.href}
              className={`px-6 py-2 rounded-full text-[9px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 relative ${
                location.pathname === item.href ? 'text-brand-primary' : 'text-white/70 hover:text-white'
              }`}
            >
              {location.pathname === item.href && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-white rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {item.name}
            </Link>
          )
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-all hover:border-white hover:bg-white/10 relative"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-white" />
          ) : (
            <Moon size={16} className="text-[#000839]" />
          )}
          {(location.pathname === '/' || location.pathname === '/speakers' || location.pathname === '/tickets') && (
            <Slash size={14} className="absolute text-red-400 rotate-[-30deg]" strokeWidth={3} />
          )}
        </button>

        {/* Menu Toggle */}
        <button 
          className="group flex items-center gap-4 border border-white/30 rounded-full pl-6 pr-4 py-2 transition-all hover:border-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-typewriter text-[9px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
            Menu
          </span>
          <div className="flex flex-col items-end gap-1.5 transition-all">
            <span className="h-[1px] bg-white transition-all duration-500 w-5 group-hover:w-7" />
            <span className="h-[1px] bg-white transition-all duration-500 w-7 group-hover:w-3" />
          </div>
        </button>
      </div>
      </motion.nav>

      {/* Menu Overlay - Full Screen Liquid (outside blend layer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] as const }}
            className="fixed inset-0 bg-brand-primary z-[150] flex flex-col pointer-events-auto border-b border-white/5 shadow-2xl text-white overflow-y-auto custom-scrollbar"
            data-lenis-prevent
          >
            {/* Liquid Background Decoration */}
            <div className="absolute inset-0 liquid-bg opacity-10 pointer-events-none" />

            <div className="flex justify-between items-center px-6 md:px-16 py-10 relative z-10">
              <span className="font-typewriter text-[10px] tracking-[1em] text-white/20 uppercase">Navigation / 2026</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="group flex items-center gap-4 text-white/40 hover:text-white transition-colors"
              >
                <span className="font-typewriter text-[10px] tracking-[0.5em] uppercase">Close</span>
                <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="flex-grow flex flex-col justify-center px-6 md:px-16 relative z-10">
              {menuItems.map((item, i) => (
                item.href.startsWith('http') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="group relative flex items-baseline gap-12 py-8 border-b border-white/5 last:border-none overflow-hidden"
                  >
                    <span className="font-typewriter text-xs text-brand-secondary/30 group-hover:text-brand-secondary transition-colors">
                      {item.id}
                    </span>
                    <div className="flex flex-col">
                      <motion.span 
                        initial={{ y: 100, rotate: 5 }}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ delay: 0.3 + (i * 0.08), duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                        className="text-5xl md:text-8xl font-kinetic font-black tracking-tighter uppercase leading-[0.8] transition-all duration-700 text-white group-hover:italic group-hover:translate-x-8"
                      >
                        {item.name}
                      </motion.span>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                        className="font-typewriter text-[9px] uppercase tracking-[1em] text-white/20 group-hover:text-white/60 transition-all pl-2 md:pl-4 mt-4"
                      >
                        {item.sub}
                      </motion.span>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group relative flex items-baseline gap-12 py-8 border-b border-white/5 last:border-none overflow-hidden"
                  >
                    <span className="font-typewriter text-xs text-brand-secondary/30 group-hover:text-brand-secondary transition-colors">
                      {item.id}
                    </span>
                    <div className="flex flex-col">
                      <motion.span 
                        initial={{ y: 100, rotate: 5 }}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ delay: 0.3 + (i * 0.08), duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                        className={`text-5xl md:text-8xl font-kinetic font-black tracking-tighter uppercase leading-[0.8] transition-all duration-700 ${
                          location.pathname === item.href ? 'text-brand-secondary' : 'text-white group-hover:italic group-hover:translate-x-8'
                        }`}
                      >
                        {item.name}
                      </motion.span>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                        className="font-typewriter text-[9px] uppercase tracking-[1em] text-white/20 group-hover:text-white/60 transition-all pl-2 md:pl-4 mt-4"
                      >
                        {item.sub}
                      </motion.span>
                    </div>
                  </Link>
                )
              ))}
            </div>

            <div className="px-6 md:px-16 py-16 flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
              <div className="max-w-xl">
                {quote ? (
                  <p className="font-editorial text-2xl md:text-3xl text-white/40 leading-tight italic">
                    "{quote.text}" <span className="text-brand-secondary block text-xs font-typewriter not-italic mt-2">, {quote.author}</span>
                  </p>
                ) : (
                  <p className="font-editorial text-2xl md:text-4xl text-white/40 leading-tight italic">
                    "The clock was <span className="text-white">already running</span> when you opened your eyes."
                  </p>
                )}
              </div>
              <div className="flex gap-16 font-typewriter text-[10px] tracking-[0.5em] uppercase">
                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">Instagram</a>
                <a href={`mailto:${SOCIALS.email}`} className="hover:text-brand-secondary transition-colors">Inquiries</a>
              </div>
            </div>

            {/* Scroll indicator at bottom of menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="pointer-events-none sticky bottom-0 flex items-center justify-center pb-4 pt-8 bg-gradient-to-t from-brand-primary to-transparent"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-typewriter text-[6px] uppercase tracking-[0.4em] text-white/15">Scroll</span>
                <motion.svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className="text-white/20"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M8 12L3 7h10L8 12z" fill="currentColor" />
                </motion.svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
