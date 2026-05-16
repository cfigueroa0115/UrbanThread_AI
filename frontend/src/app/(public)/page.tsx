import {
  HeroSection,
  FashionCollections,
  FeaturedProducts,
  FashionCTA,
  FashionCollage,
  ContactSection,
  FloatingButtons,
} from '@/components/home';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <FashionCollections />
        <FeaturedProducts />
        <FashionCTA />
        <FashionCollage />
        <ContactSection />
      </main>
      <FloatingButtons />
    </>
  );
}
