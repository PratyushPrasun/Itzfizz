import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ITZFIZZ — Scroll-Driven Rocket Hero",
  description:
    "A production-quality, scroll-driven hero section with a dark and red cinematic theme featuring a glowing 3D-style rocket. Built with Next.js, GSAP, and Tailwind CSS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="film-grain vignette min-h-full flex flex-col bg-base text-text-light">
        {children}
      </body>
    </html>
  );
}
