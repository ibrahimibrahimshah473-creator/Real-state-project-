import { db } from "@/lib/db";
import { properties, users, reviews } from "@/lib/schema";
import Link from "next/link";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { desc, sql } from "drizzle-orm";

export default async function AdminPage() {
  // Get all properties
  const allProperties = await db
    .select()
    .from(properties)
    .orderBy(desc(properties.createdAt));

  // Get total users
  const allUsers = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(users);

  // Get total reviews/ratings
  const allReviews = await db
    .select({
      propertyId: reviews.propertyId,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .groupBy(reviews.propertyId);

  // Total users
  const totalUsers = Number(allUsers[0]?.count || 0);

  // Total listing value
  const totalRevenue = allProperties.reduce(
    (sum, property) => sum + property.price,
    0
  );

  // Create rating count map
  const ratingCounts = new Map(
    allReviews.map((review) => [
      review.propertyId,
      Number(review.count),
    ])
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl font-bold text-estate-800">
          Admin Dashboard
        </h1>

        <Link
          href="/admin/properties/new"
          className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Total Properties */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Total Properties
          </p>

          <p className="text-3xl font-bold text-estate-800">
            {allProperties.length}
          </p>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Total Users
          </p>

          <p className="text-3xl font-bold text-estate-800">
            {totalUsers}
          </p>
        </div>

        {/* Total Listing Value */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Total Listings Value
          </p>

          <p className="text-3xl font-bold text-estate-800">
            PKR{" "}
            {(totalRevenue / 1000000).toFixed(1)}
            M
          </p>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-estate-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">
                  Title
                </th>

                <th className="px-4 py-3 text-left">
                  City
                </th>

                <th className="px-4 py-3 text-left">
                  Price
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Ratings
                </th>

                <th className="px-4 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {allProperties.map((property) => {
                const ratingCount =
                  ratingCounts.get(property.id) || 0;

                return (
                  <tr
                    key={property.id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Title */}
                    <td className="px-4 py-3 font-medium">
                      {property.title}
                    </td>

                    {/* City */}
                    <td className="px-4 py-3">
                      {property.city}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      PKR{" "}
                      {property.price.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gold-100 text-gold-700 rounded text-xs">
                        {property.status}
                      </span>
                    </td>

                    {/* Ratings */}
                    <td className="px-4 py-3">
                      {ratingCount}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-center">
                        <Link
                          href={`/properties/${property.id}`}
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Link>

                        <button
                          type="button"
                          title="Edit property"
                        >
                          <Edit className="w-4 h-4 text-green-500" />
                        </button>

                        <button
                          type="button"
                          title="Delete property"
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {allProperties.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}