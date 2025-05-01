// File: app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "./ClientProvider";

export const metadata: Metadata = {
  title: "Video Editor",
  description: "Web-based video editing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning silences the HTML mismatch warning on this tag
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
