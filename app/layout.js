import { Nunito, DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/layout/ClientLayout";
import Providers from "@/components/layout/Providers";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "ToyBox | Premium Toys for Kids",
  description: "Discover toys they'll love. High-end toy boutique.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-charcoal">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
