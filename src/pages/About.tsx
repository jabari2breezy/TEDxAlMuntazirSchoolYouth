import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, ArrowUpRight, Plus } from 'lucide-react';

const transition = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

export default function About() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<null | 'sending' | 'success'>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      if (res.ok) setStatus('success');
    } catch (e) {
      console.error(e);
      setStatus(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40"
    >
      <div className="px-6 md:px-16 max-w-screen-2xl mx-auto">
        <header className="mb-32 flex flex-col items-center text-center mt-12 md:mt-24 overflow-hidden">
          <motion.div
            initial={{ scale: 0.9, y: 100, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="font-typewriter text-[10px] text-brand-secondary tracking-[1em] uppercase mb-8"
            >
              Registry / Info
            </motion.div>
            <h1 className="text-[16vw] md:text-[14vw] font-title font-black tracking-tighter leading-[0.8] uppercase text-brand-primary flex flex-col items-center">
              <span>What it's</span>
              <span className="italic font-editorial lowercase text-brand-secondary">all about.</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-48">
          <div className="space-y-20">
            {[
              {
                title: "About TED",
                text: "TED is a nonprofit, nonpartisan organization devoted to Ideas Worth Spreading. Our mission is to discover and spread ideas that spark imagination, embrace possibility and catalyze impact. Started as a four-day conference in California 30 years ago, TED has grown to support its mission with multiple initiatives."
              },
              {
                title: "About TEDx",
                text: "In the spirit of ideas worth spreading, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organized events are branded TEDx, where x = independently organized TED event. The TED Conference provides general guidance for the TEDx program, but individual TEDx events are self-organized."
              },
              {
                title: "TEDxAlMuntazirSchoolsYouth",
                text: "Our event is run entirely by students, for the community of Dar es Salaam. We are exploring the theme of 'Borrowed Time' and how we individually and collectively choose to spend the moments we have."
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <span className="font-typewriter text-[10px] text-brand-secondary">0{i+1}</span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 1, 0.5, 1] }}
                    className="h-[1px] flex-grow bg-brand-outline origin-left"
                  />
                </div>
                <h3 className="text-4xl font-title font-black tracking-tighter uppercase text-brand-primary break-all sm:break-words">{item.title}</h3>
                <p className="font-editorial text-xl text-brand-primary/60 leading-tight italic">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            id="contact"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-16"
          >
            <div className="p-12 border border-brand-outline bg-brand-surface space-y-8 rounded-[3rem] shadow-sm">
              <Mail className="text-brand-secondary" size={32} />
              <h2 className="text-4xl font-title font-black tracking-tighter uppercase leading-none text-brand-primary">Get <br /> Involved.</h2>
              
              {status === 'success' ? (
                <div className="font-editorial text-2xl text-brand-secondary italic">
                  Thanks for reaching out! We'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2 border-b border-brand-outline pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Salim Ahmed" 
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-brand-primary"
                      required
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 border-b border-brand-outline pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="hello@example.com" 
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-brand-primary"
                      required
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 border-b border-brand-outline pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-brand-primary/40">How do you want to help?</label>
                    <textarea 
                      placeholder="Tell us about your ideas..." 
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-brand-primary min-h-[100px] resize-none"
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={status === 'sending'}
                    className="brutalist-button w-full group !bg-brand-secondary !text-white border-transparent"
                  >
                    {status === 'sending' ? 'Sending...' : 'Join the Conversation'}
                  </button>
                </form>
              )}
            </div>
            
            <div className="font-typewriter text-[10px] text-brand-primary/40 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
              <span className="text-brand-secondary">Note:</span> Everyone has a story to tell, and we are here to provide the platform.
            </div>
          </motion.div>
        </div>

        {/* Team section moved to /team */}
      </div>
    </motion.div>
  );
}
