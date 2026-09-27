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
    title: "Boca Raton Wi-Fi & Tech Support — ZeroPoint",
    description:
      "Local Wi-Fi help, UniFi installation, computer support, and small-business networking in Boca Raton and nearby South Florida. On-site or remote, with clear pricing.",
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
