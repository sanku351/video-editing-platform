// File: app/ClientProviders.tsx
"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/lib/redux/provider";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    // disableColorScheme prevents next-themes from injecting style="color-scheme:…"
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <ReduxProvider>
        <div className={inter.className}>
          {children}
          <Toaster />
        </div>
      </ReduxProvider>
    </ThemeProvider>
  );
}
