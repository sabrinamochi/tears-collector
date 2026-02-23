import type { Metadata } from 'next';
import { Instrument_Serif, DM_Mono } from 'next/font/google';
import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: '400',
  variable: '--font-display',
});

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'tears collector',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <svg
          width="0"
          height="0"
          className="absolute pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            {([1, 7, 13, 19, 5] as const).map((seed, i) => (
              <filter key={i} id={`wc${i}`} x="-15%" y="-15%" width="130%" height="130%">
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
