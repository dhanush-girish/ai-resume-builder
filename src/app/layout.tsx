import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI Resume Maker — Build ATS-Ready Resumes Instantly",
  description: "Craft a professional, ATS-friendly resume in minutes using AI. Input your details and let our AI handle formatting, optimization, and keyword placement.",
  keywords: "AI resume builder, ATS resume, resume maker, professional resume, career tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased min-h-screen pt-16 flex flex-col`}
      >
        <Navigation />
        <main className="min-h-[calc(100vh-4rem)] relative z-10 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
