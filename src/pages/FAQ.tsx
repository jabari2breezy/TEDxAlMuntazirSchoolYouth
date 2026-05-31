import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Ticket, MapPin, Lightbulb } from 'lucide-react';
import { Meteors } from '../components/ui/meteors';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

const FAQ_DATA = [
  {
    category: "Ticketing & Registration",
    icon: <Ticket size={18} />,
    questions: [
      {
        q: "How can I secure a ticket?",
        a: "Tickets can be purchased directly on this page! Navigate to the 'Get Tickets' section to secure your spot. Please note that tickets are strictly for STUDENTS ONLY. You must present a valid student ID at the door."
      },
      {
        q: "What does my ticket include?",
        a: "Your ticket grants you full access to all live speaker sessions, interactive workshop zones, premium networking breaks, official TEDxAlMuntazir merchandise, and a curated lunch/refreshments experience."
      },
      {
        q: "Can I get a refund or transfer my ticket to someone else?",
        a: "All ticket sales are final and non-refundable. However, you can transfer your ticket to another AlMuntazir student up to 48 hours before the event, provided you notify the organizers beforehand."
      }
    ]
  },
  {
    category: "Event Logistics & Venue",
    icon: <MapPin size={18} />,
    questions: [
      {
        q: "When and where is TEDxAlMuntazir taking place?",
        a: "The event takes place in 2026 at the Al Muntazir Islamic International Schools - Nursery Campus. Doors open strictly at 9:30 AM for registration and morning networking, with the first session starting at 10:00 AM."
      },
      {
        q: "What is the dress code for the event?",
        a: "The dress code is Smart Casual or Business Casual. We highly encourage attendees to lean into sophisticated, sharp attire that matches the premium atmosphere of the conference."
      },
      {
        q: "Will the event be streamed online?",
        a: "TEDxAlMuntazir is designed as an immersive, in-person experience to maximize networking and engagement. While the talks will be recorded and uploaded to the official TEDx YouTube channel after the event, there will be no live stream on the day."
      }
    ]
  },
  {
    category: "Theme & Content",
    icon: <Lightbulb size={18} />,
    questions: [
      {
        q: "What is the inspiration behind this year's theme, 'Borrowed Time'?",
        a: "'Borrowed Time' explores the urgency of the human experience, examining how we navigate finite moments, push boundaries in innovation, and make impactful choices before our window of opportunity closes. Our speakers will approach this from technological, cultural, and deeply personal perspectives."
      },
      {
        q: "Who are the speakers this year?",
        a: "You can view the full speaker profiles in the Speakers Section of our website. We have a diverse lineup of student voices sharing 'Ideas Worth Spreading'."
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].category);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.getAttribute('data-category') || "");
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll('.faq-section').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (category: string) => {
    const element = document.querySelector(`[data-category="${category}"]`);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="min-h-screen text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0d1a 0%, #050507 60%, #001a0d 100%)' }}
    >
      {/* Meteor Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Meteors number={50} />
      </div>

      {/* Fixed ambient glow nodes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[15%] w-[40vw] h-[40vw] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, rgba(0,109,56,0.8) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, rgba(0,8,57,0.9) 0%, transparent 70%)' }} />
      </div>

      {/* Noise texture */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%226%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }}
      />

      <div className="relative z-10 px-6 md:px-16 max-w-screen-2xl mx-auto pt-40 pb-32">
        <header className="mb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.9, y: 60, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col gap-4 items-center"
          >
            <span className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase">
              Information Center
            </span>
            <h1 className="text-7xl md:text-[8vw] font-title font-black tracking-tighter uppercase leading-[0.8] text-white flex flex-col items-center">
              <span>The</span>
              <span className="italic font-editorial lowercase text-brand-secondary">Essentials.</span>
            </h1>
          </motion.div>
        </header>

        <div id="faq-content" className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Sidebar */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-40 space-y-2">
              {FAQ_DATA.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => scrollToCategory(cat.category)}
                  className={`w-full text-left p-5 rounded-2xl flex items-center justify-between transition-all duration-500 group border ${
                    activeCategory === cat.category
                      ? 'bg-brand-secondary/20 border-brand-secondary/50 text-white shadow-lg shadow-brand-secondary/10'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${activeCategory === cat.category ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-white/5 text-white/40'}`}>
                      {cat.icon}
                    </div>
                    <span className="font-title font-black uppercase tracking-tight text-sm md:text-base">
                      {cat.category}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${activeCategory === cat.category ? 'border-brand-secondary/60 rotate-45' : 'border-brand-outline/30'}`}>
                    <Plus size={10} />
                  </div>
                </button>
              ))}

              <div className="mt-10 p-6 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-4">
                <span className="font-typewriter text-[9px] uppercase tracking-widest text-white/30 block">Still curious?</span>
                <p className="font-editorial text-lg italic text-white/50 leading-tight">
                  If you have a specific question not answered here, reach out to our team.
                </p>
                <a href="mailto:info@tedxalmuntazir.com" className="inline-block font-sans font-bold text-xs uppercase tracking-widest text-brand-secondary hover:underline">
                  Contact Organizers
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Questions */}
          <div className="lg:w-2/3 space-y-24">
            {FAQ_DATA.map((cat) => (
              <section
                key={cat.category}
                data-category={cat.category}
                className="faq-section space-y-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 h-[1px] bg-brand-secondary" />
                  <span className="font-typewriter text-[10px] text-brand-secondary tracking-[0.5em] uppercase">{cat.category}</span>
                </div>

                <div className="space-y-4">
                  {cat.questions.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group border border-white/10 rounded-2xl bg-white/5 hover:border-brand-secondary/40 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden"
                    >
                      <button
                        className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-4"
                        onClick={() => setOpenQuestion(openQuestion === `${cat.category}-${i}` ? null : `${cat.category}-${i}`)}
                      >
                        <h4 className="text-xl md:text-2xl font-title font-black uppercase text-white tracking-tighter leading-none flex-1">
                          {faq.q}
                        </h4>
                        <div className={`shrink-0 w-8 h-8 rounded-full border border-brand-outline/30 flex items-center justify-center transition-all duration-300 ${openQuestion === `${cat.category}-${i}` ? 'rotate-45 border-brand-secondary/50 bg-brand-secondary/10' : ''}`}>
                          <Plus size={14} className={openQuestion === `${cat.category}-${i}` ? 'text-brand-secondary' : 'text-white/40'} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {openQuestion === `${cat.category}-${i}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="font-editorial text-lg md:text-xl text-white/50 italic leading-relaxed px-6 md:px-8 pb-8">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
