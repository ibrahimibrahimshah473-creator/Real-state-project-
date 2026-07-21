"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function NewPropertyPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", price: "", type: "HOUSE", status: "FOR_SALE",
    bedrooms: "", bathrooms: "", area: "", areaUnit: "marla",
    address: "", city: "", state: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) => setImages((prev) => [...prev, ...files]),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Please upload at least one image");

    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach((img) => formData.append("images", img));
    formData.append("features", JSON.stringify([]));

    const res = await fetch("/api/properties", { method: "POST", body: formData });
    setSubmitting(false);
    if (res.ok) { toast.success("Property added!"); router.push("/admin"); }
    else toast.error("Upload failed");
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="font-display text-4xl font-bold text-estate-800 mb-8">Add New Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input placeholder="Title" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-4 py-3 border rounded-lg" />
          <input placeholder="Price" type="number" required value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="px-4 py-3 border rounded-lg" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-4 py-3 border rounded-lg">
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
            <option value="PLOT">Plot</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-4 py-3 border rounded-lg">
            <option value="FOR_SALE">For Sale</option>
            <option value="FOR_RENT">For Rent</option>
          </select>
          <input placeholder="Bedrooms" type="number" value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
            className="px-4 py-3 border rounded-lg" />
          <input placeholder="Bathrooms" type="number" value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            className="px-4 py-3 border rounded-lg" />
          <input placeholder="Area" type="number" required value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            className="px-4 py-3 border rounded-lg" />
          <select value={form.areaUnit} onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}
            className="px-4 py-3 border rounded-lg">
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
            <option value="sqft">Square Feet</option>
          </select>
          <input placeholder="Address" required value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="px-4 py-3 border rounded-lg md:col-span-2" />
          <input placeholder="City" required value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="px-4 py-3 border rounded-lg" />
          <input placeholder="State/Province" required value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="px-4 py-3 border rounded-lg" />
        </div>

        <textarea placeholder="Description" required rows={4} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg" />

        {/* Image Upload */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gold-500"
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p>Drag & drop images here, or click to select</p>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-lg disabled:opacity-50"
        >
          {submitting ? "Uploading..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}