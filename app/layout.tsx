import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Qui a balancé ? – Le jeu des secrets",
  description: "Écris un secret sur un coéquipier, puis devine qui a balancé le tien.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${display.variable} font-display`}>{children}</body>
    </html>
  );
}
