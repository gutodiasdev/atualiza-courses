import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "AtualizaDigital Courses",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userPromise = getUser();

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="antialiased">
        <UserProvider userPromise={userPromise}>
          <Providers>
            {children}
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
