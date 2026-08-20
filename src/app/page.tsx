import { IntroOverlay } from "@/components/intro/IntroOverlay";
import { ParticleField } from "@/components/fx/ParticleField";
import { Hero } from "@/components/landing/Hero";
import { JudgeGrid } from "@/components/landing/JudgeGrid";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <ParticleField className="pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative">
        <Hero />
        <JudgeGrid />
      </div>
      <IntroOverlay />
    </div>
  );
}
