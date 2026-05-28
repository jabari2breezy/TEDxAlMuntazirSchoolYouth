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
  instagram: 'https://instagram.com/almuntazirschools',
  email: 'tedxalmuntazirschoolsyouth@gmail.com'
};

export const TICKETS_URL = '/tickets';

export const SPEAKERS: Speaker[] = [
  {
    id: '1',
    name: 'Ridhwan Mohammed',
    topic: 'Topic to be announced',
    bio: "Ridhwan Mohammed explores the historical narratives that have shaped our current reality.",
    talk_description: "Ridhwan will examine the threads connecting our past to today, revealing how historical events echo through generations and influence our present decisions. This session explores the power of memory and cultural heritage in shaping identity.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '2',
    name: 'Anaya Rashid',
    topic: 'The Culture of Time',
    bio: 'Exploring how different cultures perceive and value the passage of time.',
    talk_description: "Anaya delves into the fascinating ways societies around the world experience and organize time. From hourly schedules to cyclical calendars, discover how cultural frameworks shape our relationship with duration, urgency, and the future.",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '3',
    name: 'Zahra Datoo',
    topic: 'The Architecture of Nostalgia',
    bio: 'How our built environment preserves or distorts our collective memory.',
    talk_description: "Zahra investigates the relationship between physical spaces and human memory. Explore how architecture, urban design, and heritage preservation shape nostalgia, belonging, and our connection to place—and what happens when buildings vanish.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '4',
    name: 'Zahra Moledina',
    topic: "Capitalism's Clock",
    bio: 'Analyzing the intersection of economic growth and our finite global resources.',
    talk_description: "Zahra examines how capitalism structures our perception of time and urgency. Discover the hidden costs of constant productivity, the myth of infinite growth on a finite planet, and how rethinking our economic relationship with time could reshape society.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '5',
    name: 'Hassan Abbas Mohammed',
    topic: 'The Procrastination Paradox',
    bio: 'The psychology behind why we delay the things that matter most.',
    talk_description: "Hassan explores the deep psychological roots of procrastination—why we know what we should do but delay anyway. Uncover the relationship between fear, perfectionism, and timing, and discover practical pathways to reclaiming agency over your actions.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '6',
    name: 'Yunus Osman',
    topic: 'The Art of Scheduling',
    bio: 'Decoding intentional scheduling and reclaiming control over our future.',
    talk_description: "Yunus reveals how strategic scheduling is an art form that places power back in your hands. Learn to design time architecture that honors your values, productivity rhythms, and human needs—transforming vague goals into tangible reality.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '7',
    name: 'Sada Mbaruk Said',
    topic: 'Three Clocks: Climate, Animals, AI',
    bio: "Sada explores the concept of 'slow destruction' and our collective responsibility before the damage becomes irreversible.",
    talk_description: "Sada presents three interconnected crises running on different timescales: climate change's gradual acceleration, biodiversity loss unfolding silently, and AI's exponential growth. Understand the urgency of the present moment and how we can act before tipping points become irreversible.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '8',
    name: 'Liyaan Karbelkar',
    topic: 'The Legacy We Leave',
    bio: 'Defining stewardship for the generations that will inherit our world.',
    talk_description: "Liyaan envisions legacy as active stewardship rather than passive inheritance. Explore how young leaders can build meaningful contributions today, embed sustainability in decision-making, and consciously shape the world future generations will inhabit.",
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '9',
    name: 'Speaker TBA',
    topic: 'Topic to be announced',
    bio: 'Our ninth speaker will be announced soon.',
    talk_description: 'More details about this exciting speaker will be revealed soon. Stay tuned for a transformative perspective on time, legacy, and human connection.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  }
];
