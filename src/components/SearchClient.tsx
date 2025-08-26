"use client";

import { useState } from "react";

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return; // block empty searches
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query.trim(), page: 1, per_page: 20 }),
      });
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      setItems([]);
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
          aria-label="Search"
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
            href={`${process.env.NEXT_PUBLIC_API_URL}/click?id=${encodeURIComponent(item.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg p-4 hover:shadow transition cursor-pointer block"
          >
            <img
              src={item.image_url || "/placeholder.webp"}
              alt={item.title || "Item"}
              className="w-full h-48 object-cover rounded mb-2"
              onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.webp")}
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
