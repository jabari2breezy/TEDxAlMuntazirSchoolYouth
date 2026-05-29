import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import Navbar from './components/Navbar';
import FloatingCursor from './components/FloatingCursor';
import InteractiveBackground from './components/InteractiveBackground';
import CurtainTransition from './components/CurtainTransition';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import Theme from './pages/Theme';
import SpeakersPage from './pages/Speakers';
import About from './pages/About';
import Agenda from './pages/Agenda';
import FAQ from './pages/FAQ';
import Tickets from './pages/Tickets';
import Team from './pages/Team';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useEffect } from 'react';

/* ── Global Scroll Progress Bar ── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-brand-secondary z-[200] origin-left"
      style={{ scaleX }}
    />
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/theme" element={<Theme />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/team" element={<Team />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <SmoothScroll />
      <div className="relative selection:bg-brand-secondary selection:text-white min-h-screen flex flex-col">
          <ScrollProgress />
          <InteractiveBackground />
          <CurtainTransition />
          <FloatingCursor />
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          
          {/* Oryzo-style scanline overlay */}
          <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
          <ScrollToTopButton />
        </div>
    </Router>
  );
}
