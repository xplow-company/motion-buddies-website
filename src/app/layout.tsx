import type { Metadata, Viewport } from "next";
import { Caveat, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

const title = "Motion Buddies";
const description =
  "Motion Buddies is a motion design studio for AI and SaaS products. Make your product move people.";

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://motionbuddies.com"),
  openGraph: {
    title,
    description,
    url: "https://motionbuddies.com",
    siteName: "Motion Buddies",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The inline script adds `js` before paint so reveal states never flash.
    <html lang="en" className={`${instrument.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
