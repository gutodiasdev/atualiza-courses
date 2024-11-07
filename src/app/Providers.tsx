"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./ThemeProvider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Providers = ({ children }: { children: React.ReactNode; }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-right" />
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;