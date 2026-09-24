import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteChat } from "@/components/services/service-chat";
import { MotionProvider } from "@/components/motion-provider";
import { pageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: "ZeroPoint — Homelabs, Home Networking, Business Technology, and Websites",
    description:
      "Hands-on homelab knowledge, better home networking, straightforward technology setup for small businesses, and websites and dashboards for restaurants and small businesses.",
    path: "/",
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <MotionProvider>
          {children}
          <SiteChat />
        </MotionProvider>
      </body>
    </html>
  );
}
