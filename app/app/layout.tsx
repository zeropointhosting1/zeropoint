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
    title: "ZeroPoint — IT Support, Networking, and Websites for Small Businesses and Homes in Boca Raton",
    description:
      "Local IT support in Boca Raton, FL: monthly managed support, office networks and Wi-Fi, websites for small businesses and restaurants, and home networking.",
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
