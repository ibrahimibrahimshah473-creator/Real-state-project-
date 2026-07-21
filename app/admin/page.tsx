import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash, Eye } from "lucide-react";

export default async function AdminPage() {
  const properties = await prisma.property.findMany({
    include: { user: { select: { name: true } }, _count: { select: { ratings: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = await prisma.user.count();
  const totalRevenue = properties.reduce((s, p) => s + p.price, 0);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl font-bold text-estate-800">Admin Dashboard</h1>
        <Link
          href="/admin/properties/new"
          className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Properties</p>
          <p className="text-3xl font-bold text-estate-800">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-estate-800">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Listings Value</p>
          <p className="text-3xl font-bold text-estate-800">PKR {(totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-estate-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Ratings</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">{p.city}</td>
                <td className="px-4 py-3">PKR {p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-gold-100 text-gold-700 rounded text-xs">{p.status}</span>
                </td>
                <td className="px-4 py-3">{p._count.ratings}</td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <Link href={`/properties/${p.id}`}><Eye className="w-4 h-4 text-blue-500" /></Link>
                  <button><Edit className="w-4 h-4 text-green-500" /></button>
                  <button><Trash className="w-4 h-4 text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}