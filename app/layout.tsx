import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  weight: '45 920'
});

export const metadata: Metadata = {
  title: 'Your AI Video Maker',
  description: 'Your AI Video Maker'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={`${pretendard.className} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <main className="relative min-w-0 flex-1 bg-[#05080d]">{children}</main>
      </body>
    </html>
  );
}
