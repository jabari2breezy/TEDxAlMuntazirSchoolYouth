import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';

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
      className="pt-40 relative min-h-screen text-white overflow-hidden"
      style={{ background: '#000000' }}
    >
      <div className="relative z-10 px-6 md:px-16 max-w-screen-2xl mx-auto pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 mb-32">
          {/* Left: Empty - just spacing */}
          <div className="space-y-16">
            {/* Removed all hero text and info blocks - blank black */}
          </div>

          {/* Right: Contact Form */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-12"
          >
            <div className="p-8 md:p-12 border border-white/10 bg-white/5 backdrop-blur-md space-y-8 rounded-[2.5rem]">
              <Mail className="text-brand-secondary" size={32} />
              <h2 className="text-4xl md:text-5xl font-title font-black tracking-tighter uppercase leading-none text-white">
                Get <br /> Involved.
              </h2>

              {status === 'success' ? (
                <div className="font-editorial text-2xl text-brand-secondary italic">
                  Thanks for reaching out! We'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2 border-b border-white/10 pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-white/30">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Salim Ahmed"
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-white placeholder:text-white/30 outline-none"
                      required
                      value={formState.name}
                      onChange={e => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 border-b border-white/10 pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-white/30">Email Address</label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-white placeholder:text-white/30 outline-none"
                      required
                      value={formState.email}
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 border-b border-white/10 pb-4 focus-within:border-brand-secondary transition-colors">
                    <label className="font-typewriter text-[9px] uppercase tracking-widest text-white/30">How do you want to help?</label>
                    <textarea
                      placeholder="Tell us about your ideas..."
                      className="w-full bg-transparent border-none focus:ring-0 font-editorial text-2xl italic text-white placeholder:text-white/30 min-h-[100px] resize-none outline-none"
                      value={formState.message}
                      onChange={e => setFormState({ ...formState, message: e.target.value })}
                    />
                  </div>
                  <button
                    disabled={status === 'sending'}
                    className="w-full py-4 bg-brand-secondary text-white font-title font-black uppercase tracking-widest text-sm rounded-full hover:bg-brand-primary hover:text-white transition-all duration-500"
                  >
                    {status === 'sending' ? 'Sending...' : 'Join the Conversation'}
                  </button>
                </form>
              )}
            </div>

            <div className="font-typewriter text-[10px] text-white/30 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
              <span className="text-brand-secondary">Note:</span> Everyone has a story to tell, and we are here to provide the platform.
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
