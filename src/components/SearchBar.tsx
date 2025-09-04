"use client";

import { useState } from 'react';

interface SmartSearchBarProps {
  onSearch?: (filters: any) => void;
  placeholder?: string;
}

export default function SmartSearchBar({ 
  onSearch, 
  placeholder = "Try: 'nike shoes under $50'"
}: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    console.log('Submitting search:', query); // Debug log
    setLoading(true);

    try {
      // Call onSearch with basic filters for now
      if (onSearch) {
        onSearch({
          q: query,
          brands: [],
          sizes: [],
          conditions: [],
          marketplaces: [],
          sort: 'best',
          page: 1,
          perPage: 24
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {loading ? "..." : "Search"}
      </button>
    </form>
  );
}
