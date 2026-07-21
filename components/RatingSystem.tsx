"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function RatingSystem({ propertyId }: { propertyId: string }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const submitRating = async () => {
    if (!session) { toast.error("Please login to rate"); return; }
    if (rating === 0) { toast.error("Please select a rating"); return; }

    setSubmitting(true);
    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, score: rating }),
    });
    setSubmitting(false);
    if (res.ok) toast.success("Rating submitted!");
    else toast.error("Failed to submit");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="font-display text-xl font-bold text-estate-800 mb-4">Rate this Property</h3>
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              (hover || rating) >= star ? "fill-gold-500 text-gold-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <button
        onClick={submitRating}
        disabled={submitting}
        className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}