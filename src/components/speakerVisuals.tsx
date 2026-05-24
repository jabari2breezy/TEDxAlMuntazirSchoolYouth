/** Maps speakers to topic-themed 3D visual keys (by name + topic). */
export type SpeakerVisualKey =
  | 'heritage'
  | 'culture-time'
  | 'nostalgia'
  | 'capitalism-clock'
  | 'procrastination'
  | 'scheduling'
  | 'three-clocks'
  | 'legacy'
  | 'default';

export function resolveSpeakerVisual(name: string, topic: string): SpeakerVisualKey {
  const n = name.toLowerCase();
  const t = topic.toLowerCase();

  if (n.includes('ridhwan') || t.includes('heritage') || t.includes('alum')) return 'heritage';
  if (t.includes('culture of time') || n.includes('anaya')) return 'culture-time';
  if (t.includes('nostalgia') || n.includes('datoo')) return 'nostalgia';
  if (t.includes('capitalism') || t.includes('sliced bread') || n.includes('moledina')) return 'capitalism-clock';
  if (t.includes('procrastination') || n.includes('hassan')) return 'procrastination';
  if (t.includes('scheduling') || n.includes('yunus')) return 'scheduling';
  if (t.includes('three clocks') || t.includes('climate') || n.includes('sada')) return 'three-clocks';
  if (t.includes('legacy') || t.includes('wealth') || n.includes('liyaan')) return 'legacy';

  return 'default';
}
