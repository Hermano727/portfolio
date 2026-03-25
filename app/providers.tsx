"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ScrollOrchestratorProvider } from "@/context/ScrollOrchestratorContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ScrollOrchestratorProvider>
        {children}
      </ScrollOrchestratorProvider>
    </NextUIProvider>
  );
}
