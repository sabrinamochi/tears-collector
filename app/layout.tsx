import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";


const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-ui",
});


const SITE = 'https://sabrinamochi.github.io';
const BASE = `${SITE}/tears-collector`;

export const metadata = {
  title: "Tears Collector",
  description: "A small project documenting my feelings after being laid off.",
  openGraph: {
    title: "Tears Collector",
    description: "A small project documenting my feelings after being laid off.",
    url: `${BASE}/`,
    siteName: "Tears Collector",
    images: [
      {
        url: `${BASE}/social.jpg`, // ABSOLUTE
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tears Collector",
    description: "A small project documenting my feelings after being laid off.",
    images: [`${BASE}/social.jpg`], // ABSOLUTE
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <svg
          width="0"
          height="0"
          className="absolute pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            {([1, 7, 13, 19, 5] as const).map((seed, i) => (
              <filter
                key={i}
                id={`wc${i}`}
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.038 0.052"
                  numOctaves={4}
                  seed={seed}
                  result="n"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="n"
                  scale={1.8}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            ))}
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
