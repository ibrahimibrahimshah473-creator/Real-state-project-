"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react";
import { Property } from "@prisma/client";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-64">
          <Image
            src={property.images[0] || "/placeholder.jpg"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.status.replace("_", " ")}
          </div>
          <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white">
            <Heart className="w-5 h-5 text-rose-500" />
          </button>
        </div>
        <div className="p-5">
          <div className="text-2xl font-bold text-estate-800 mb-1">
            {property.currency} {property.price.toLocaleString()}
          </div>
          <h3 className="font-semibold text-lg mb-2 truncate">{property.title}</h3>
          <p className="text-gray-600 text-sm flex items-center gap-1 mb-3">
            <MapPin className="w-4 h-4" /> {property.city}, {property.address}
          </p>
          <div className="flex items-center gap-4 pt-3 border-t text-gray-700 text-sm">
            {property.bedrooms && (
              <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms}</span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>
            )}
            <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {property.area} {property.areaUnit}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}