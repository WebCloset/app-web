"use client";

import { useEffect, useState } from "react";
import SaveSearchModal from "./SaveSearchModal";
import Toast from "./Toast";

type Item = {
  id: string;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number | null;
};

export default function SearchClient() {
  const [query, setQuery] = useState("levis");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function run(q: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    if (query) {
      run(query); 
    }
  }, []);

  function handleSaveSuccess() {
    setToastMessage("Search saved! You'll be notified of new matches.");
    setShowToast(true);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
        onSubmit={(e) => { e.preventDefault(); run(query); }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Search items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="border rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Results header with save button */}
      {items.length > 0 && query && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            Results for "{query}" ({items.length} items)
          </h2>
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            Save Search
          </button>
        </div>
      )}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <a key={it.id} href={`/item/${it.id}`} className="border rounded p-4 hover:shadow-md transition-shadow">
            <img
              src={it.image_url || "/placeholder.svg"}
              alt={it.title || ""}
              className="w-full h-40 object-cover mb-3 rounded"
            />
            <div className="text-sm text-gray-600">{it.brand}</div>
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm text-gray-900 font-medium">
              {it.price_cents != null ? `$${(it.price_cents / 100).toFixed(2)}` : ""}
            </div>
            <div className="text-xs text-gray-500">{it.listings_count ?? 0} listings</div>
          </a>
        ))}
      </div>

      <SaveSearchModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        searchQuery={query}
        onSuccess={handleSaveSuccess}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </div>
  );
}
