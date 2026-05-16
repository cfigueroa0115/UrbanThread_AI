import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartPanel } from '@/components/cart/CartPanel';
import { FashionBackground } from '@/components/shared/FashionBackground';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FashionBackground />
      <Header variant="public" />
      {children}
      <Footer />
      <CartPanel />
    </>
  );
}
