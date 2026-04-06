import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_THEME_MODE } from "../presentation/styles/theme";
import { ThemeProvider } from "../presentation/styles/theme-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "lowcode App",
  description: "Created with lowcode",
  generator: "lowcode.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME_MODE}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}