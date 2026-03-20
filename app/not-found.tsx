import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function NotFound() {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-background px-6">
          <main className="flex w-full max-w-5xl flex-col items-center gap-4 text-center">
            <span className="gradient-brand-text text-8xl font-extrabold tracking-tight">
              404
            </span>
            <Text variant="h1" className="sm:text-5xl">
              Page not found
            </Text>
            <Text variant="body-lg" color="muted">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </Text>
            <Link href="/" className="mt-2">
              <Button variant="ghost">&larr; Back to home</Button>
            </Link>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
