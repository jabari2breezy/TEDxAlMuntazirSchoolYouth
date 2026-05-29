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
    name: 'Ridhwan Mohamed',
    topic: 'Borrowed Time, Borrowed Selves',
    bio: "Ridhwan Mohamed explores the myth of mastery, urging us to embrace our complexity rather than conforming to societal expectations. He argues that we can pursue multiple paths simultaneously, advocating for a life defined by diverse experiences over singular specialization.",
    talk_description: "A meditation on the complexity of identity and the courage to live 'multiple lives.' Ridhwan challenges the 'Jack of all trades' stigma, demonstrating that true mastery isn't found in a single box, but in the deliberate, courageous pursuit of our diverse psychological and personal interests.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '2',
    name: 'Anaya Rashid',
    topic: 'Culture of Time',
    bio: 'Anaya examines how different cultures perceive time—whether linear, cyclical, strict, or fluid—and reflects on the "Kashmakash" (inner struggle) between our desire to slow down and the impulse to rush.',
    talk_description: "A journey through the relativity of time, from the strict precision of Japanese punctuality to the gentle, fluid rhythms of South Asian tea traditions. Anaya invites us to find presence in the 'blue hour' and reclaim our moments from the grip of constant busyness.",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '3',
    name: 'Zahra Datoo',
    topic: 'Nostalgia',
    bio: 'Zahra reflects on the strange power of nostalgia to connect us to our past and anchor us in the present, arguing that our most meaningful moments occur when we are simply being, not doing.',
    talk_description: "A study on how small, seemingly ordinary moments—rain on a window, a family fort, shared laughter—become the cornerstones of our emotional resilience. Zahra contends that productivity should not be confused with fulfillment, and that our memories are the true anchors of a well-lived life.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '4',
    name: 'Zahra Moledina',
    topic: 'Capitalism',
    bio: 'Zahra critiques "attention capitalism," where our time and focus are harvested as currency. She advocates for reclaiming agency over our attention by embracing boredom and intentional silence.',
    talk_description: "An exploration of how convenience has become an addictive system designed to colonize our time. Zahra shares her own experiment with silence and boredom to demonstrate how we can regain control over our attention, shifting our focus from being 'products' of the attention economy to 'users' of our own existence.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '5',
    name: 'Hassan Abbas',
    topic: 'Procrastination',
    bio: 'Hassan analyzes procrastination through Parkinson’s Law and the Zeigarnik Effect, arguing it is a problem to be solved, not a character flaw. He proposes an "IDEAL Plan" for reclaiming momentum.',
    talk_description: "A deep dive into the psychological loops that keep us stuck in the 'waiting' phase. Hassan shares his own experience of panic-induced procrastination and offers a toolkit—including the 5-Minute Rule and micro-deadlines—to bridge the gap between intention and action.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '6',
    name: 'Yunus Osman',
    topic: 'The Art of Scheduling',
    bio: 'Yunus shares his transformation from feeling lost to finding purpose through intentional scheduling. He redefines scheduling as a path to freedom—creating space for faith, family, and meaningful work.',
    talk_description: "A practical philosophy on scheduling that moves beyond corporate productivity. Yunus shows how a simple list can transform a 'blurry' existence into a life of purpose, allowing space for what truly matters: faith, health, and deep human connections, without the burnout.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '7',
    name: 'Sada Mbaruk Said',
    topic: 'End of the world',
    bio: 'Sada argues that environmental destruction and conflict are interconnected, creeping forward through small, ignored actions. She emphasizes that the "end of the world" is a gradual unraveling caused by collective apathy.',
    talk_description: "A chilling but urgent exploration of how slow destruction works. Sada illustrates the chain reaction from conflict to environmental collapse, arguing that our collective failure to care about small, localized problems is the true catalyst for the global crises we now face.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '8',
    name: 'Liyaan Karbelkar',
    topic: 'How to take your wealth with you',
    bio: 'Liyaan uses the story of Alexander the Great to illustrate that legacy, not material accumulation, is the only true "wealth" we can take with us. She advocates for active stewardship and impact.',
    talk_description: "A powerful perspective on legacy, inspired by Alexander the Great’s final wish to leave his hands open in his coffin. Liyaan redefines 'wealth' not as money or awards, but as the impact we have on the people we influence and the paths we inspire others to follow.",
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  }
];
