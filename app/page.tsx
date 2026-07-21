"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Search, Home, MapPin, Star } from "lucide-react";
import Link from "next/link";

const ThreeScene = dynamic(() => import("@/components/ThreeScene"), { ssr: false });

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* HERO with 3D */}
      <section className="relative h-screen bg-gradient-to-br from-estate-800 via-estate-700 to-estate-900 overflow-hidden">
        <ThreeScene />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Find Your <span className="text-gold-400">Dream Home</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 max-w-2xl text-gray-200"
          >
            Pakistan's premium real estate platform. Buy, sell, rent properties across the nation.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-full p-2 flex items-center gap-2 w-full max-w-3xl shadow-2xl"
          >
            <div className="flex items-center gap-2 px-4 flex-1 border-r">
              <Home className="w-5 h-5 text-gold-600" />
              <select className="bg-transparent outline-none text-gray-800 py-3 w-full">
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-4 flex-1 border-r">
              <MapPin className="w-5 h-5 text-gold-600" />
              <input
                placeholder="City or area..."
                className="bg-transparent outline-none text-gray-800 py-3 w-full"
              />
            </div>
            <button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" /> Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: "10,000+", l: "Properties Listed" },
            { n: "50,000+", l: "Happy Customers" },
            { n: "25+", l: "Cities Covered" },
            { n: "4.9★", l: "Average Rating" },
          ].map((s) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold text-estate-700 mb-2">{s.n}</div>
              <div className="text-gray-600">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-estate-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Ready to Find Home?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of satisfied property owners and buyers.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="bg-gold-500 hover:bg-gold-600 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/listings"
              className="border-2 border-white hover:bg-white hover:text-estate-800 px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}