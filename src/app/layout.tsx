import React from "react";
import Navigation from "./Navigation";
import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: 'PhotoRestore AI',
  description: 'Restaure suas memórias com o poder da Inteligência Artificial',
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50">
            <Navigation />
            <main className="px-6 pb-12">
              {children}
            </main>
            <div className="fixed -z-10 top-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
            <div className="fixed -z-10 bottom-20 left-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
            <div className="fixed -z-10 top-1/2 left-1/2 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
          </div>
        </Providers>
      </body>
    </html>
  );
}