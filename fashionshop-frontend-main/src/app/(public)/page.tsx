import { HeroSection } from '@/components/home/hero-section';
import { CategoryCurationSection } from '@/components/home/category-curation-section';
import { NewArrivalsSection } from '@/components/home/new-arrivals-section';
import { ArchiveBannerSection } from '@/components/home/archive-banner-section';
import { NewsletterSection } from '@/components/home/newsletter-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryCurationSection />
      <NewArrivalsSection />
      <ArchiveBannerSection />
      <NewsletterSection />
    </>
  );
}
