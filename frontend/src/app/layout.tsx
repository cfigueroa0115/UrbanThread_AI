import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/lib/providers";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { AnalyticsTracker } from "@/components/shared/AnalyticsTracker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UrbanThread AI — Smart Commerce Platform",
    template: "%s | UrbanThread AI",
  },
  description:
    "Plataforma Smart Commerce integral que conecta clientes, datos y operaciones mediante IA, automatización e identidad digital.",
  keywords: [
    "UrbanThread AI",
    "Smart Commerce",
    "retail",
    "moda",
    "inteligencia artificial",
    "automatización",
    "plataforma",
  ],
  authors: [{ name: "UrbanThread AI" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "UrbanThread AI",
    title: "UrbanThread AI — Smart Commerce Platform",
    description:
      "Plataforma Smart Commerce integral que conecta clientes, datos y operaciones mediante IA, automatización e identidad digital.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <AnalyticsTracker />
          {children}
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
