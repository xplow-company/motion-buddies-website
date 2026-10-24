import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
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
    <html lang="en" className={instrument.variable} suppressHydrationWarning>
      <body>
        <Script id="js-class" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        {children}
      </body>
    </html>
  );
}
