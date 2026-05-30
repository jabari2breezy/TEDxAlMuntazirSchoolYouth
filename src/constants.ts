/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Speaker {
  id: string;
  name: string;
  topic: string;
  bio: string;
  talk_description: string;
  image: string;
  segmentId: string;
  isAlum?: boolean;
}

export interface Segment {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

export const SEGMENTS: Segment[] = [
  {
    id: 'past',
    number: '01',
    title: 'The Past',
    subtitle: 'MEMORY & HERITAGE',
    description: 'Where we came from shapes who we are. Explore memory, culture, and the weight of history.',
    color: 'bg-brand-primary'
  },
  {
    id: 'present',
    number: '02',
    title: 'The Present',
    subtitle: 'ACTION & AWARENESS',
    description: 'The only moment we truly inhabit. Confront procrastination, capitalism, and the urgency of now.',
    color: 'bg-brand-secondary'
  },
  {
    id: 'future',
    number: '03',
    title: 'The Future',
    subtitle: 'LEGACY & VISION',
    description: 'The time we are borrowing against. Legacy, climate, AI — what we leave for those who come after.',
    color: 'bg-brand-primary'
  }
];

export const SOCIALS = {
  instagram: 'https://www.instagram.com/almuntazirschool?igsh=MTg2MmhrZzZoamY4eQ==',
  email: 'tedxalmuntazirschoolsyouth@gmail.com'
};

export const TICKETS_URL = '/tickets';

export const SPEAKERS: Speaker[] = [
  {
    id: 'ridhwan-mohammed',
    name: 'Ridhwan Mohammed',
    topic: 'Borrowed Time, Borrowed Selves',
    bio: "4th year medical student. Debater. Public speaker. The kind of person who can't stick to just one thing.",
    talk_description: "Identity isn't something you find — it's something you build, borrow, and outgrow. Ridhwan makes the case that we don't have to be just one person. Through neuroplasticity and lived experience, he shows how we can assemble ourselves from multiple versions, and why that's not a weakness — it's the whole point.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past',
    isAlum: true
  },
  {
    id: 'anaya-rashid',
    name: 'Anaya Rashid',
    topic: 'Culture of Time',
    bio: "Student. Overthinker. The kind of person who notices the small things most people walk past.",
    talk_description: "Time doesn't change — we do. Anaya explores how different cultures experience the same hours in completely different ways, and what it means when you realize you were physically present but mentally somewhere else entirely.",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: 'zahra-datoo',
    name: 'Zahra Datoo',
    topic: 'Nostalgia',
    bio: "Student. Memory collector. The kind of person who holds onto rainy afternoons and never lets go.",
    talk_description: "The best moments in life don't feel extraordinary while they're happening — they only become priceless later. Zahra explores how nostalgia works, why ordinary moments matter more than we think, and what it means to be truly present before the moment becomes a memory.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: 'zahra-moledina',
    name: 'Zahra Moledina',
    topic: 'The Best Thing Since Sliced Bread',
    bio: "Student. Professional overthinker of everything. Currently questioning her screen time stats.",
    talk_description: "We think we're using our phones — but what if they're using us? Zahra looks at how convenience has become a system designed to take our attention, and what happens when you sit in silence long enough to notice where your time actually goes.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: 'speaker-tba',
    name: 'TBA',
    topic: 'TBA',
    bio: "Speaker details to be announced soon.",
    talk_description: "More details about this session will be available soon.",
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: 'hassan-abbas',
    name: 'Hassan Abbas Muhammad',
    topic: 'Procrastination',
    bio: "Student. Former serial procrastinator. The guy who gave a TED talk while an exam sat on his desk the next day.",
    talk_description: "Procrastination isn't about laziness — it's about how our brains handle time, pressure, and discomfort. Hassan breaks down the psychology behind why we delay, and offers a practical system for breaking the loop before it breaks you.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: 'yunus-osman',
    name: 'Yunus Osman',
    topic: 'The Art of Scheduling',
    bio: "Second year medical student. Co-founder of Legions Org. The kind of person who somehow makes time for everything and still goes to the beach.",
    talk_description: "One to-do list changed everything. Yunus shares how a tiny habit pulled him from feeling lost to living with intention — and why scheduling isn't about control, it's about making space for the things that actually matter.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future',
    isAlum: true
  },
  {
    id: 'sada-mbaruk',
    name: 'Sada Mbaruk',
    topic: 'End of the World',
    bio: "Student. Observer. The kind of person who connects the dots most people don't even see.",
    talk_description: "The end of the world doesn't arrive with sirens. It creeps in quietly — through small choices, ignored warnings, and problems we assumed someone else would fix. Sada traces how everything connects, and why the time to care is running out.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: 'liyaan-karblekar',
    name: 'Liyaan Karblekar',
    topic: 'How to Take Your Wealth With You',
    bio: "Student. Storyteller. The kind of person who makes Alexander the Great sound like a life coach.",
    talk_description: "Alexander the Great left the world with his hands empty. Liyaan uses that image to explore what true wealth looks like — not money or status, but the impact you leave behind. Legacy isn't built someday. It's built in what you do next.",
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  }
];
