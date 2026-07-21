"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, LogOut, Shield, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Home className="w-6 h-6 text-gold-500" />
          <span className="font-display text-2xl font-bold text-estate-800">Zameen</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/listings" className="text-gray-700 hover:text-gold-600 font-medium">
            Properties
          </Link>
          {session ? (
            <>
              {role === "ADMIN" && (
                <Link href="/admin" className="flex items-center gap-1 text-gold-600 font-medium">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-1 text-gray-700">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-gold-600 font-medium">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gold-500 hover:bg-gold-600 text-white px-5 py-2 rounded-full font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}