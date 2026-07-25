import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NişanKare | Bir Kare De Siz Bırakın 🤍",
  description: "20 Ağustos nişan organizasyonunda galerinizdeki fotoğrafları bizimle kolayca paylaşın.",
  openGraph: {
    title: "NişanKare - Fotoğraf Paylaşımı",
    description: "Bu güzel geceden bir kare de siz bırakın.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAF6F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className="h-full flex flex-col antialiased selection:bg-romantic-200 selection:text-romantic-900">
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 md:py-10 flex flex-col justify-between">
          {children}
        </main>
      </body>
    </html>
  );
}
