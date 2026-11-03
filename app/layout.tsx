import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ReactQueryProvider } from "@/lib/react-query";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Rope4 | Outdoor Education, Treks & Adventures Worldwide",
  description:
    "Rope4 Outdoor Education offers certified mountaineering programs, youth survival camps, family treks, and adventure gear worldwide. Learn and Share.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background font-sans text-foreground">
        <ReactQueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

