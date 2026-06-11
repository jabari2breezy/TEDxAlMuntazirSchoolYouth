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
export const TUKIIO_CHECKOUT_URL = 'https://tukiio.com/event/tedxalmuntazirschoolsyouth';

export const SPEAKERS: Speaker[] = [
  {
    id: 'ridhwan-mohammed',
    name: 'Ridhwan Mohammed',
    topic: 'From Neurons to Narratives',
    bio: "Ridhwan Mohamed is a medical student, speaker, and advocate for youth engagement in health and leadership. Through his work with student organizations, public health initiatives, and community outreach projects, he is passionate about exploring how people grow, adapt, and find purpose beyond traditional expectations.",
    talk_description: "At TEDx, he will share insights on identity, resilience, and the power of embracing the many dimensions of who we are.",
    image: '/speakers/ridhwan.jpg',
    segmentId: 'past',
    isAlum: true
  },
  {
    id: 'anaya-rashid',
    name: 'Anaya Rashid',
    topic: 'Culture of Time',
    bio: "Student. Overthinker. The kind of person who notices the small things most people walk past.",
    talk_description: "Time doesn't change — we do. Anaya explores how different cultures experience the same hours in completely different ways, and what it means when you realize you were physically present but mentally somewhere else entirely.",
    image: '/speakers/anaya.png',
    segmentId: 'past'
  },
  {
    id: 'zahra-datoo',
    name: 'Zahra Datoo',
    topic: 'Borrowed Time',
    bio: "Zahra Datoo is a student, writer, and curious thinker passionate about reading, storytelling, and inspiring others.",
    talk_description: "She takes the TEDxAlMuntazirSchoolYouth stage with her talk, \"Borrowed Time,\" exploring why we romanticize the past and long for moments that have already passed. Through reflection and insight, she reminds us that while nostalgia helps us cherish where we've been, there is still so much waiting for us ahead.",
    image: '/speakers/zahra-datoo.png',
    segmentId: 'past'
  },
  {
    id: 'zahra-moledina',
    name: 'Zahra Moledina',
    topic: 'Silence is never empty',
    bio: "Student. Professional overthinker of everything. Currently questioning her screen time stats.",
    talk_description: "We think we're using our phones — but what if they're using us? Zahra looks at how convenience has become a system designed to take our attention, and what happens when you sit in silence long enough to notice where your time actually goes.",
    image: '/speakers/zahra-moledina.png',
    segmentId: 'present'
  },
  {
    id: 'dr-atish-shah',
    name: 'Dr. Atish Shah',
    topic: 'Yet to be announced',
    bio: "Dr. Atish Shah is a physician, engineer, and innovator exploring the intersection of medicine, engineering, and artificial intelligence. Through his company, he develops technology-driven solutions to address real-world healthcare challenges.",
    talk_description: "At TEDx Al Muntazir Schools Youth 2026, he will examine how emerging technologies can shape healthier and more sustainable futures, helping us make the most of our 'borrowed time'.",
    image: '/speakers/atish.jpg',
    segmentId: 'present'
  },
  {
    id: 'hassan-abbas',
    name: 'Hassan Abbas Muhammad',
    topic: 'POV of a Procrastinator',
    bio: "Hassan Abbas is a student with a keen interest in personal growth and productivity.",
    talk_description: "Through his TEDxAlMuntazirSchoolYouth talk, \"Tomorrow Starts Today,\" he explores the challenge of procrastination and how delaying action can quietly steal opportunities, time, and potential. Drawing from relatable experiences, he encourages audiences to take ownership of the present moment and make meaningful progress before time slips away.",
    image: '/speakers/hassan.jpg',
    segmentId: 'present'
  },
  {
    id: 'yunus-osman',
    name: 'Yunus Osman',
    topic: 'The Art of Scheduling',
    bio: "Second year medical student. Co-founder of Legions Org. The kind of person who somehow makes time for everything and still goes to the beach.",
    talk_description: "One to-do list changed everything. Yunus shares how a tiny habit pulled him from feeling lost to living with intention — and why scheduling isn't about control, it's about making space for the things that actually matter.",
    image: '/speakers/yunus.jpg',
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
    name: 'Liyaan Karbelkar',
    topic: 'How to Take Your Wealth With You',
    bio: "Liyaan Karbelkar is a student passionate about exploring new ideas, reflecting on life's deeper questions, and understanding the impact we leave behind.",
    talk_description: "In her TEDxAlMuntazirSchoolYouth talk, \"How to Take Your Wealth With You,\" she explores how our actions, choices, and values shape the mark we leave on the world long after we are gone. She invites audiences to reflect on the legacy they are building and how they can make every moment count within the limited time they have.",
    image: '/speakers/liyaan.jpg',
    segmentId: 'future'
  }
];
