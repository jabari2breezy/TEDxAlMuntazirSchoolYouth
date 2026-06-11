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
    bio: "Anaya Rashid is a student who is deeply intrigued by the rhythms of life and the unseen patterns that shape human behavior.",
    talk_description: "In her TEDxAlMuntazirSchoolYouth talk, 'The Culture of Time,' she explores how different societies perceive, value, and live through time. From fast-paced modern lifestyles to more reflective traditions, she challenges audiences to rethink their relationship with time and how culture influences the way we use every passing moment under the theme Borrowed Time.",
    image: '/speakers/anaya.jpg',
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
    bio: "Zahra Moledina is a student who is passionate about sharing ideas that inspire others and creating a positive impact in her community.",
    talk_description: "In her TEDxAlMuntazirSchoolYouth talk, she explores the true value of silence and how embracing quiet moments can help us create a better understanding of ourselves, our purpose, and our place in the world. Through her message, she encourages others to slow down, reflect, and listen to the thoughts that often go unheard.",
    image: '/speakers/zahra-moledina.png',
    segmentId: 'present'
  },
  {
    id: 'dr-atish-shah',
    name: 'Dr. Atish Shah',
    topic: 'Yet to be announced',
    bio: "Dr. Atish Shah is a physician, engineer, and innovator exploring the intersection of medicine, engineering, and artificial intelligence. Through his company, he develops technology-driven solutions to address real-world healthcare challenges.",
    talk_description: "At TEDx Al Muntazir Schools Youth 2026, he will examine how emerging technologies can shape healthier and more sustainable futures, helping us make the most of our 'borrowed time'.",
    image: '/speakers/atish.png',
    segmentId: 'present'
  },
  {
    id: 'hassan-abbas',
    name: 'Hassan Abbas Muhammad',
    topic: 'POV of a Procrastinator',
    bio: "Hassan Abbas is a student with a keen interest in personal growth and productivity.",
    talk_description: "Through his TEDxAlMuntazirSchoolYouth talk, \"POV of a Procrastinator,\" he explores the challenge of procrastination and how delaying action can quietly steal opportunities, time, and potential. Drawing from relatable experiences, he encourages audiences to take ownership of the present moment and make meaningful progress before time slips away.",
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
    topic: "What Does the End of the World Mean for My Generation?",
    bio: "Sada Mbaruk is a student passionate about exploring urgent global questions and their impact on the next generation.",
    talk_description: "In her TEDxAlMuntazirSchoolYouth talk, \"What Does the End of the World Mean for My Generation?\" she examines how young people are inheriting a world shaped by conflict, environmental destruction, and global uncertainty. She reflects on what it means to grow up with these realities and how her generation must navigate and respond to the lasting impacts of today's world.",
    image: '/speakers/sada.png',
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
