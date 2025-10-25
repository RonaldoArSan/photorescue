"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, History, LogOut } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Implement logout logic here
    window.location.href = '/login';
  };

  return (
    <nav className="px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="clay-card bg-white/80 backdrop-blur-xl rounded-3xl px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="clay-button bg-linear-to-br from-purple-200 to-pink-200 p-4 rounded-2xl float-animation">
                <Sparkles className="w-7 h-7 text-purple-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  PhotoRestore AI
                </h1>
                <p className="text-sm text-gray-500">Restaure suas memórias</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <button className={`clay-button px-6 py-3 rounded-2xl font-medium transition-all ${
                  pathname === "/"
                    ? 'bg-linear-to-br from-purple-200 to-pink-200 text-purple-700'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
                }`}>
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Restaurar
                </button>
              </Link>

              <Link href="/gallery">
                <button className={`clay-button px-6 py-3 rounded-2xl font-medium transition-all ${
                  pathname === "/gallery"
                    ? 'bg-linear-to-br from-blue-200 to-teal-200 text-blue-700'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
                }`}>
                  <History className="w-5 h-5 inline mr-2" />
                  Galeria
                </button>
              </Link>

              <button 
                onClick={handleLogout}
                className="clay-button p-3 rounded-2xl bg-white/60 text-gray-700 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}