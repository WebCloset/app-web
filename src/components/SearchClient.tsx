"use client";

import { useState, useEffect } from "react";
import Filters from "./Filters";

type Item = {
  id: string;
  brand: string | null;
  title: string | null;
  category: string | null;
  image_url: string | null;
  price_cents: number | null;
  listings_count: number | null;
  condition: string | null;
  marketplace_code: string | null;
  size: string | null;
  seller_urls: string[];
};

interface FilterState {
  q: string;
  brands: string[];
  sizes: string[];
  conditions: string[];
  marketplaces: string[];
  priceMin: string;
  priceMax: string;
  sort: 'best' | 'price_asc' | 'price_desc' | 'newest';
}

export default function SearchClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    q: "",
    brands: [],
    sizes: [],
    conditions: [],
    marketplaces: [],
    priceMin: "",
    priceMax: "",
    sort: "best"
  });
  const [searchStats, setSearchStats] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false
  });

  // API base URL - point to your FastAPI server
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const performSearch = async (filters: FilterState, page: number = 1) => {
    setLoading(true);
    setError("");
    
    try {
      // Prepare the request body
      const searchBody = {
        q: filters.q.trim(),
        brands: filters.brands,
        sizes: filters.sizes,
        conditions: filters.conditions,
        marketplaces: filters.marketplaces,
        price_min: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
        price_max: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
        sort: filters.sort,
        page: page,
        per_page: 24
      };

      // Remove undefined values
      const cleanBody = Object.fromEntries(
        Object.entries(searchBody).filter(([_, value]) => 
          value !== undefined && value !== "" && 
          !(Array.isArray(value) && value.length === 0)
        )
      );

      const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanBody)
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setItems(data.items || []);
      setSearchStats({
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.total_pages || 0,
        hasMore: data.has_more || false
      });
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : "Search failed");
      setItems([]);
      setSearchStats({ total: 0, page: 1, totalPages: 0, hasMore: false });
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (filters: FilterState) => {
    setCurrentFilters(filters);
    performSearch(filters);
  };

  // Handle item clicks (redirect through your API for tracking)
  const handleItemClick = (item: Item) => {
    // Open in new tab via your click tracking endpoint
    window.open(`${API_BASE}/click?id=${item.id}`, '_blank');
  };

  // Load more items (pagination) - prevents duplicates
  const loadMore = async () => {
    if (searchStats.hasMore && !loading) {
      const nextPage = searchStats.page + 1;
      
      setLoading(true);
      
      try {
        // Prepare the request body for next page
        const searchBody = {
          q: currentFilters.q.trim(),
          brands: currentFilters.brands,
          sizes: currentFilters.sizes,
          conditions: currentFilters.conditions,
          marketplaces: currentFilters.marketplaces,
          price_min: currentFilters.priceMin ? parseFloat(currentFilters.priceMin) : undefined,
          price_max: currentFilters.priceMax ? parseFloat(currentFilters.priceMax) : undefined,
          sort: currentFilters.sort,
          page: nextPage,
          per_page: 24
        };

        // Remove undefined values
        const cleanBody = Object.fromEntries(
          Object.entries(searchBody).filter(([_, value]) => 
            value !== undefined && value !== "" && 
            !(Array.isArray(value) && value.length === 0)
          )
        );

        const response = await fetch(`${API_BASE}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanBody)
        });

        if (!response.ok) {
          throw new Error(`Load more failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Get existing item IDs to prevent duplicates
        const existingIds = new Set(items.map(item => item.id));
        const newItems = (data.items || []).filter(item => !existingIds.has(item.id));
        
        // Append new items without duplicates
        setItems(prevItems => [...prevItems, ...newItems]);
        setSearchStats({
          total: data.total || 0,
          page: data.page || nextPage,
          totalPages: data.total_pages || 0,
          hasMore: data.has_more || false
        });
        
      } catch (err) {
        console.error('Load more error:', err);
        setError(err instanceof Error ? err.message : "Failed to load more items");
      } finally {
        setLoading(false);
      }
    }
  };
  // Format price display
  const formatPrice = (priceCents: number | null) => {
    if (priceCents === null) return "Price not available";
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters Component */}
      <Filters onFiltersChange={handleFiltersChange} loading={loading} />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Search Results Header */}
        {!loading && (
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentFilters.q ? `Search results for "${currentFilters.q}"` : 'All Items'}
              </h1>
              <span className="text-sm text-gray-600">
                {searchStats.total.toLocaleString()} items found
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium">Search Error</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
            <button 
              onClick={() => performSearch(currentFilters)}
              className="mt-2 text-sm text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && items.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-gray-600">Searching...</div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No items found</div>
            <div className="text-gray-400 text-sm">Try adjusting your search or filters</div>
          </div>
        )}

        {/* Items Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* Item Image */}
                <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title || "Item"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                {/* Item Details */}
                <div className="p-4">
                  {/* Brand */}
                  {item.brand && (
                    <div className="text-sm text-gray-500 mb-1 font-medium">
                      {item.brand}
                    </div>
                  )}
                  
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title || "Untitled Item"}
                  </h3>
                  
                  {/* Price */}
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {formatPrice(item.price_cents)}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{item.listings_count} listing{item.listings_count !== 1 ? 's' : ''}</span>
                    {item.condition && (
                      <span className="capitalize">{item.condition.split(',')[0].trim()}</span>
                    )}
                  </div>
                  
                  {/* Size */}
                  {item.size && (
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        Size {item.size}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {searchStats.hasMore && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More Items
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {items.length > 0 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            Showing {items.length} of {searchStats.total.toLocaleString()} items
            {searchStats.totalPages > 1 && (
              <span> • Page {searchStats.page} of {searchStats.totalPages}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
