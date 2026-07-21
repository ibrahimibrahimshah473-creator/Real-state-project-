"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function NewPropertyPage() {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "HOUSE",
    status: "FOR_SALE",
    bedrooms: "",
    bathrooms: "",
    area: "",
    areaUnit: "marla",
    address: "",
    city: "",
    state: "",
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },

    multiple: true,

    onDrop: (acceptedFiles) => {
      setImages((previousImages) => [
        ...previousImages,
        ...acceptedFiles,
      ]);
    },
  });

  const removeImage = (indexToRemove: number) => {
    setImages((currentImages) =>
      currentImages.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (images.length === 0) {
      toast.error(
        "Please upload at least one property image"
      );

      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append(
        "features",
        JSON.stringify([])
      );

      const response = await fetch(
        "/api/properties",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create property"
        );
      }

      toast.success(
        "Property added successfully!"
      );

      router.push("/admin");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="font-display text-4xl font-bold text-estate-800 mb-8">
        Add New Property
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* BASIC INFORMATION */}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Property Title"
            required
            value={form.title}
            onChange={(event) =>
              setForm({
                ...form,
                title: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          />

          <input
            placeholder="Price"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={(event) =>
              setForm({
                ...form,
                price: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          />

          {/* PROPERTY TYPE */}

          <select
            value={form.type}
            onChange={(event) =>
              setForm({
                ...form,
                type: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          >
            <option value="HOUSE">
              House
            </option>

            <option value="APARTMENT">
              Apartment
            </option>

            <option value="PLOT">
              Plot
            </option>

            <option value="COMMERCIAL">
              Commercial
            </option>
          </select>

          {/* SALE OR RENT */}

          <select
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          >
            <option value="FOR_SALE">
              For Sale
            </option>

            <option value="FOR_RENT">
              For Rent
            </option>
          </select>

          <input
            placeholder="Bedrooms"
            type="number"
            min="0"
            value={form.bedrooms}
            onChange={(event) =>
              setForm({
                ...form,
                bedrooms: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          />

          <input
            placeholder="Bathrooms"
            type="number"
            min="0"
            value={form.bathrooms}
            onChange={(event) =>
              setForm({
                ...form,
                bathrooms: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          />

          <input
            placeholder="Area"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.area}
            onChange={(event) =>
              setForm({
                ...form,
                area: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          />

          <select
            value={form.areaUnit}
            onChange={(event) =>
              setForm({
                ...form,
                areaUnit: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          >
            <option value="marla">
              Marla
            </option>

            <option value="kanal">
              Kanal
            </option>

            <option value="sqft">
              Square Feet
            </option>
          </select>

          {/* ADDRESS */}

          <input
            placeholder="Address"
            required
            value={form.address}
            onChange={(event) =>
              setForm({
                ...form,
                address: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg md:col-span-2"
          />

          <input
            placeholder="City"
            required
            value={form.city}
            onChange={(event) =>
              setForm({
                ...form,
                city: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          />

          <input
            placeholder="State / Province"
            required
            value={form.state}
            onChange={(event) =>
              setForm({
                ...form,
                state: event.target.value,
              })
            }
            className="px-4 py-3 border rounded-lg"
          />
        </div>

        {/* DESCRIPTION */}

        <textarea
          placeholder="Property Description"
          required
          rows={5}
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
          className="w-full px-4 py-3 border rounded-lg"
        />

        {/* IMAGE UPLOAD */}

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gold-500"
        >
          <input {...getInputProps()} />

          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />

          <p>
            Drag & drop images here,
            or click to select
          </p>
        </div>

        {/* IMAGE PREVIEWS */}

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((image, index) => {
              const imageUrl =
                URL.createObjectURL(image);

              return (
                <div
                  key={`${image.name}-${index}`}
                  className="relative aspect-square"
                >
                  <img
                    src={imageUrl}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-lg disabled:opacity-50"
        >
          {submitting
            ? "Uploading..."
            : "Add Property"}
        </button>
      </form>
    </div>
  );
}