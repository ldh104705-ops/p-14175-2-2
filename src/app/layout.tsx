import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "글 게시판",
  description: "Next.js + Spring Boot 글 게시판",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <header>
          <nav className="flex gap-4 p-2 border-b">
            <Link href="/">홈</Link>
            <Link href="/posts">글 목록</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="p-2 border-t text-center">푸터</footer>
      </body>
    </html>
  );
}
