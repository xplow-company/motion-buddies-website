import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#08090d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MOTION BUDDIES — Make your product move people",
  description:
    "We design high-impact 3D motion, kinetic brand systems, and interactive digital experiences that turn passive viewers into passionate customers.",
  keywords: [
    "motion design",
    "3D animation",
    "product motion",
    "interactive web",
    "creative studio",
    "motion buddies",
  ],
  authors: [{ name: "Motion Buddies Studio" }],
  creator: "Motion Buddies",
  metadataBase: new URL("https://motionbuddies.com"),
  openGraph: {
    title: "MOTION BUDDIES — Make your product move people",
    description:
      "High-impact 3D animation, interactive digital experiences, and motion systems that move people.",
    url: "https://motionbuddies.com",
    siteName: "Motion Buddies",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOTION BUDDIES — Make your product move people",
    description:
      "High-impact 3D animation, interactive digital experiences, and motion systems that move people.",
    creator: "@motionbuddies",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#08090d] text-[#f4f5f8] antialiased selection:bg-purple-500/30 selection:text-white font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
