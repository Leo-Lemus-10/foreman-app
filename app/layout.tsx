import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction Daily Reports",
  description: "Foreman daily field reporting dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 font-sans antialiased">{children}</body>
    </html>
  );
}
