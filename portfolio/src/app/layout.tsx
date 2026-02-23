import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muhammadquddous.dev"),
  title: "Muhammad Quddous | Software Developer Portfolio",
  description:
    "Muhammad Quddous is an aspiring software developer specializing in web development, Python, data structures, and information security. Explore projects and skills.",
  keywords: [
    "Muhammad Quddous",
    "software developer",
    "web developer",
    "Python",
    "React",
    "portfolio",
    "information security",
  ],
  authors: [{ name: "Muhammad Quddous" }],
  creator: "Muhammad Quddous",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://muhammadquddous.dev",
    title: "Muhammad Quddous | Software Developer Portfolio",
    description:
      "Aspiring software developer passionate about web development, Python, and information security.",
    siteName: "Muhammad Quddous Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Muhammad Quddous Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Quddous | Software Developer Portfolio",
    description:
      "Aspiring software developer passionate about web development, Python, and information security.",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
