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
    bio: "Ridhwan Mohamed is a 4th-year medical student at KCMC University, Vice President of one of the largest student associations in Tanzania, a competitive debater, and a 2x TEDx speaker. Born and raised in Dar es Salaam, he has spent years balancing medicine, debate, public speaking, and community leadership.",
    talk_description: "Through the lens of neuroplasticity and identity, Ridhwan challenges the myth of mastery and the 'Jack of all trades' stigma. Drawing on examples from stroke recovery to his own debate career, he argues that we are temporary versions of ourselves, and that borrowing confidence through action—not waiting for it—is how we assemble who we truly are.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '2',
    name: 'Anaya Rashid',
    topic: 'Culture of Time',
    bio: "Anaya explores how different cultures perceive and experience time, drawing from her Pakistani heritage and observations of global traditions. She examines the tension between precision and fluidity, and how cultural backgrounds shape our relationship with moments and memories.",
    talk_description: "From the samurai-sword precision of Japanese punctuality to the 12-hour-early airport arrivals of South Asian families, Anaya reveals that time doesn't change—we do. She introduces the Urdu words 'kashmakash' (inner struggle) and 'malal' (soft regret) to describe the quiet battle between rushing and being present, urging us to find beauty in ordinary moments before the petals fall.",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '3',
    name: 'Zahra Datoo',
    topic: 'Nostalgia',
    bio: "Zahra Datoo explores how the most meaningful moments in life often arrive disguised as ordinary ones—a rainy afternoon, a family sleepover, a conversation with strangers who become friends. She reflects on why nostalgia is both a gift and a gentle warning.",
    talk_description: "Opening with a thought experiment about trading a thousand dollars for tomorrow, Zahra examines how nostalgia functions as proof that we were truly alive. Drawing on personal stories—playing in the rain with her uncle, building pillow forts, meeting strangers at competitions—she argues that productivity and fulfillment are not the same thing, and that our most powerful currency is the moments we are fully present for.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '4',
    name: 'Zahra Moledina',
    topic: 'Capitalism',
    bio: "Zahra Moledina investigates the hidden cost of convenience and how our relationship with technology has shifted from tool to dependency. She explores attention capitalism through personal experiments with silence and stillness.",
    talk_description: "Beginning with a single notification that consumed an hour, Zahra traces the path from sliced bread to sliced attention. She reveals how apps are designed to harvest our focus, turning our time into corporate revenue. Through a Sunday experiment sitting in silence without her phone, she discovered that distraction takes time without you noticing, but silence shows you where your time actually goes—and that awareness is where control begins.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '5',
    name: 'Hassan Abbas',
    topic: 'Procrastination',
    bio: "Hassan Abbas is a student who has lived the procrastination cycle firsthand—giving a TED talk while facing an exam the next day. He combines psychological research with practical strategies to break the loop of delay.",
    talk_description: "Hassan dissects procrastination through Parkinson's Law (work expands to fill available time), instant gratification, and the Zeigarnik Effect (unfinished tasks creating mental loops). He shares his own 2 AM panic stories and offers a concrete toolkit: the 5-Minute Rule, micro-deadlines, forgiveness of past self, and activation energy—proving that starting small rewires the brain to finish big.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '6',
    name: 'Yunus Osman',
    topic: 'The Art of Scheduling',
    bio: "Yunus Osman is a 20-year-old second-year medical student at Ubed Kariuki Memorial University, co-founder of Legions Org, and active in multiple youth-centered initiatives. He once felt lost internally despite appearing fine outwardly, until one simple habit changed everything.",
    talk_description: "Yunus shares how writing down a single daily to-do list transformed him from feeling lost to living with intention. He redefines scheduling not as rigid productivity but as freedom—the ability to make time for faith, family, friendships, and purpose. His message: your schedule reveals what you truly value, and borrowed time demands intentional spending.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '7',
    name: 'Sada Mbaruk Said',
    topic: 'End of the world',
    bio: "Sada Mbaruk Said examines how destruction doesn't arrive as a single catastrophe but as a slow, interconnected chain reaction—from conflict to societal collapse, from environmental degradation to climate crisis. She challenges us to see the dominoes before they fall.",
    talk_description: "Sada traces a devastating chain: small inactions lead to conflict, conflict destroys communities, collapsing societies strip natural resources, and environmental damage escalates into climate crisis. Using UN research and vivid imagery, she argues that the 'end of the world' is not one disaster but millions of moments where humanity chose not to care—and that every year we delay makes the consequences harder to reverse.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '8',
    name: 'Liyaan Karbelkar',
    topic: 'How to take your wealth with you',
    bio: "Liyaan Karbelkar uses the story of Alexander the Great to redefine what it means to be wealthy. She argues that legacy—not money, followers, or awards—is the only wealth that survives us, and that it is built through consistent, courageous action.",
    talk_description: "Opening with Alexander's legendary request to be buried with his hands empty, Liyaan presents the ACTION framework: Act before you're ready, Choose how you use your time, Track progress not just movement, Invest in small actions, Overcome fear, and Never delay your potential. She argues that impact is the only currency that outlives us—and that greatness was never reserved for emperors alone.",
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  }
];
