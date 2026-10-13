import type { Metadata } from "next";
import { Sora, Inter, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Justin Arteche — I build solutions for a better tomorrow",
  description: "Justin Arteche is a Junior Web Developer & Computer Engineering student turning ideas into real-world applications with focus on impact, usability, and innovation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${caveat.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#05010f] text-[#f4f2ff] selection:bg-violet-600/40 selection:text-white">
        {children}
      </body>
    </html>
  );
}
