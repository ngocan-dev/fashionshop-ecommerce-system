import { ManifestoSection } from '@/components/about/manifesto-section';
import { MaterialsSection } from '@/components/about/materials-section';
import { StorySection } from '@/components/about/story-section';
import { SustainabilitySection } from '@/components/about/sustainability-section';

export default function AboutPage() {
  return (
    <section className="bg-zinc-100 py-10 md:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1480px] space-y-14 px-4 md:space-y-16 md:px-8 lg:space-y-20 lg:px-12">
        <ManifestoSection />
        <StorySection />
        <MaterialsSection />
        <SustainabilitySection />
      </div>
    </section>
  );
}
