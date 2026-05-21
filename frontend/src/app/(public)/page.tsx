import {
  HeroSection,
  FashionCollections,
  FeaturedProducts,
  FashionCTA,
  FashionCollage,
  ContactSection,
  FloatingButtons,
  ExecutiveInsightsMini,
} from '@/components/home';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <FashionCollections />
        <FeaturedProducts />
        <FashionCTA />
        <ExecutiveInsightsMini />
        <FashionCollage />
        <ContactSection />
      </main>
      <FloatingButtons />
    </>
  );
}
