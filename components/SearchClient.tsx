"use client";

import { useState } from "react";

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/item/${item.id}`}
            className="border rounded-lg p-4 hover:shadow transition cursor-pointer block"
          >
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.title || "Item"}
              className="w-full h-48 object-cover rounded mb-2"
              onError={(e) =>
                ((e.currentTarget as HTMLImageElement).src =
                  "/placeholder.svg")
              }
            />
            <div className="font-semibold">
              {item.brand ? `${item.brand} — ` : ""}
              {item.title || "Untitled"}
            </div>
            <div className="text-gray-500">
              {item.price_cents != null
                ? `$${(item.price_cents / 100).toFixed(2)}`
                : "—"}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
