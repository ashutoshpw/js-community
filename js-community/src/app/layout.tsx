import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "JS Community - Connect, Learn, and Grow Together",
  description:
    "Join the vibrant JavaScript community. Connect with developers, share knowledge, and grow your skills through engaging discussions and collaborative learning.",
  keywords: [
    "JavaScript",
    "community",
    "developers",
    "programming",
    "web development",
    "learning",
    "discussion",
  ],
  authors: [{ name: "JS Community" }],
  openGraph: {
    title: "JS Community - Connect, Learn, and Grow Together",
    description:
      "Join the vibrant JavaScript community. Connect with developers, share knowledge, and grow your skills.",
    type: "website",
    locale: "en_US",
    siteName: "JS Community",
  },
  twitter: {
    card: "summary_large_image",
    title: "JS Community - Connect, Learn, and Grow Together",
    description:
      "Join the vibrant JavaScript community. Connect with developers, share knowledge, and grow your skills.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
