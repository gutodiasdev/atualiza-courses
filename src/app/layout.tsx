import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AtualizaDigital Courses",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900">
        {children}
      </body>
    </html>
  );
}
