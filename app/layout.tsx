import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lowcode App",
  description: "Created with Lowcode",
  generator: "Lowcode APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
