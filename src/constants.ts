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
    bio: "4th year medical student. Debater. Public speaker. The kind of person who can't stick to just one thing.",
    talk_description: "We're told to pick a lane. Be one thing. Master it. But Ridhwan thinks that's a lie. Through neuroplasticity, competitive debate, and his own experience juggling medicine with everything else he loves, he makes a case that identity isn't fixed — it's something we borrow, build, and outgrow. You don't find yourself. You assemble yourself, one borrowed version at a time.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '2',
    name: 'Anaya Rashid',
    topic: 'Culture of Time',
    bio: "Student. Overthinker. The kind of person who notices the small things most people walk past.",
    talk_description: "Why does five minutes during an exam feel like forever, but an entire evening with family disappears in seconds? Anaya grew up between cultures that treat time completely differently — where your dad wakes you up half a day before a flight, where weddings start three hours late, where a cup of chai without a handle forces you to slow down. She explores the Urdu words 'kashmakash' and 'malal' to describe what happens when we realize we were there, but not really there.",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '3',
    name: 'Zahra Datoo',
    topic: 'Nostalgia',
    bio: "Student. Memory collector. The kind of person who holds onto rainy afternoons and never lets go.",
    talk_description: "If someone offered you a thousand dollars on the condition you never wake up tomorrow, you'd say no. Zahra starts there. She talks about the uncle who said 'wear your sweater' and took her out to play in the pouring rain. About building terrible pillow forts that felt amazing. About how the best moments in life don't feel extraordinary while they're happening — they only become priceless later. Nostalgia isn't about the past. It's proof you were actually there.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '4',
    name: 'Zahra Moledina',
    topic: 'Capitalism',
    bio: "Student. Professional overthinker of everything. Currently questioning her screen time stats.",
    talk_description: "Zahra picked up her phone to answer a math question. An hour later she'd watched seventeen reels and forgotten why she picked it up. That one distraction made her realize something bigger — we're not just using our phones, our phones are using us. She sat in silence for an entire Sunday afternoon with no phone, no music, no distractions. What happened next changed how she sees time, attention, and the quiet cost of convenience.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '5',
    name: 'Hassan Abbas',
    topic: 'Procrastination',
    bio: "Student. Former serial procrastinator. The guy who gave a TED talk while an exam sat on his desk the next day.",
    talk_description: "Hassan once watched a YouTube video about transmissions at 2 AM instead of studying for a physics exam due the next morning. Sound familiar? He breaks down exactly why our brains do this — Parkinson's Law, the Zeigarnik Effect, the weird mental loops that won't close until you finish that one thing. Then he gives you a way out. The 5-Minute Rule. Micro-deadlines. A real system that works when willpower doesn't.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '6',
    name: 'Yunus Osman',
    topic: 'The Art of Scheduling',
    bio: "Second year medical student. Co-founder of Legions Org. The kind of person who somehow makes time for everything and still goes to the beach.",
    talk_description: "Yunus felt lost. Not physically — internally. He could still laugh, still show up, still function. But something was off. Then one day he wrote down what he needed to do. Just a list. No podcast. No productivity course. That tiny habit turned his blurry life into something he could actually see. He's here to tell you that scheduling isn't about becoming a robot — it's about finally having enough time for the things that matter.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '7',
    name: 'Sada Mbaruk Said',
    topic: 'End of the world',
    bio: "Student. Observer. The kind of person who connects the dots most people don't even see.",
    talk_description: "The end of the world won't come with sirens and collapsing skies. It comes quietly — through forests left empty, oceans filled with pollution, communities broken by conflict. Sada traces the dominoes: small inactions that become wars, wars that collapse societies, collapsing societies that strip the land, stripped land that feeds the climate crisis. The people who contribute least to these problems suffer the most. And every year we wait, the chain gets harder to stop.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '8',
    name: 'Liyaan Karbelkar',
    topic: 'How to take your wealth with you',
    bio: "Student. Storyteller. The kind of person who makes Alexander the Great sound like a life coach.",
    talk_description: "Alexander the Great conquered one of the largest empires in history. His final request? To be buried with his hands hanging outside the coffin — empty. Liyaan takes that story and flips it. She breaks down how legacy, not money, is the only wealth you can actually take with you. Act before you're ready. Choose how you spend your time. Invest in small actions. Overcome fear. Never delay your potential. Because one day your hands will be empty too — the question is what you did with them.",
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  }
];
