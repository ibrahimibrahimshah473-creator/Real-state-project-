import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Zameen - Pakistan's Premier Real Estate Platform",
  description: "Buy, sell, and rent properties across Pakistan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        <Navbar />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}