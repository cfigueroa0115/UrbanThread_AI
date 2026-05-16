import { FashionBackground } from '@/components/shared/FashionBackground';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FashionBackground />
      {children}
    </>
  );
}
