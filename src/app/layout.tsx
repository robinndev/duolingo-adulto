import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { IdentityGate } from "@/components/IdentityGate";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "duolingo adulto",
  description: "jogo do casal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={mono.variable}>
      <body className="min-h-dvh antialiased">
        <div className="mx-auto max-w-md min-h-dvh px-5 pt-8 pb-24">{children}</div>
        <IdentityGate />
      </body>
    </html>
  );
}
