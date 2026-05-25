import SpeakerTopicVisual from './SpeakerTopicVisual';

interface StructuralForegroundProps {
  name: string;
  topic: string;
  image?: string;
}

/** Layer 3 — topic sculpture (no nested blur that breaks rendering) */
export default function StructuralForeground({ name, topic, image }: StructuralForegroundProps) {
  return (
    <div className="relative w-full max-w-md mx-auto py-4">
      <SpeakerTopicVisual name={name} topic={topic} image={image} />
    </div>
  );
}
