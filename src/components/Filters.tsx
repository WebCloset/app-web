"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

interface FiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  loading?: boolean;
}

// Common filter options based on your data
const BRAND_OPTIONS = ['Nike', 'Adidas', 'Supreme', 'Levi\'s', 'Gucci', 'Louis Vuitton'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', '28', '29', '30', '31', '32', '33', '34', '36'];
const CONDITION_OPTIONS = ['New', 'Good', 'Used', 'Fair'];
const MARKETPLACE_OPTIONS = ['ebay', 'poshmark', 'mercari', 'grailed'];
const SORT_OPTIONS = [
  { value: 'best', label: 'Best Match' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' }
] as const;

export default function Filters({ onFiltersChange, loading = false }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    q: '',
    brands: [],
    sizes: [],
    conditions: [],
    marketplaces: [],
    priceMin: '',
    priceMax: '',
    sort: 'best'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const newFilters: FilterState = {
      q: searchParams.get('q') || '',
      brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
      sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
      conditions: searchParams.get('conditions')?.split(',').filter(Boolean) || [],
      marketplaces: searchParams.get('marketplaces')?.split(',').filter(Boolean) || [],
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      sort: (searchParams.get('sort') as FilterState['sort']) || 'best'
    };
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [searchParams]);

  // Update URL and notify parent when filters change
  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    
    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.brands.length > 0) params.set('brands', newFilters.brands.join(','));
    if (newFilters.sizes.length > 0) params.set('sizes', newFilters.sizes.join(','));
    if (newFilters.conditions.length > 0) params.set('conditions', newFilters.conditions.join(','));
    if (newFilters.marketplaces.length > 0) params.set('marketplaces', newFilters.marketplaces.join(','));
    if (newFilters.priceMin) params.set('priceMin', newFilters.priceMin);
    if (newFilters.priceMax) params.set('priceMax', newFilters.priceMax);
    if (newFilters.sort !== 'best') params.set('sort', newFilters.sort);
    
    // Update URL without causing a page refresh
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Toggle array filter (brands, sizes, etc.)
  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ ...filters, [key]: newArray });
  };

  // Update single filter
  const updateSingleFilter = (key: keyof FilterState, value: string) => {
    updateFilters({ ...filters, [key]: value });
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      q: filters.q, // Keep search query
      brands: [],
      sizes: [],
      conditions: [],
      marketplaces: [],
      priceMin: '',
      priceMax: '',
      sort: 'best'
    };
    updateFilters(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.brands.length > 0 || 
    filters.sizes.length > 0 || 
    filters.conditions.length > 0 || 
    filters.marketplaces.length > 0 || 
    filters.priceMin || 
    filters.priceMax || 
    filters.sort !== 'best';

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search for items..."
              value={filters.q}
              onChange={(e) => updateSingleFilter('q', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Sort Dropdown */}
          <select
            value={filters.sort}
            onChange={(e) => updateSingleFilter('sort', e.target.value as FilterState['sort'])}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Filters {hasActiveFilters && `(${[...filters.brands, ...filters.sizes, ...filters.conditions, ...filters.marketplaces].length + (filters.priceMin || filters.priceMax ? 1 : 0)})`}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-4 pb-4 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={filters.priceMin}
                    onChange={(e) => updateSingleFilter('priceMin', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500 self-center">-</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={filters.priceMax}
                    onChange={(e) => updateSingleFilter('priceMax', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brands
                </label>
                <div className="flex flex-wrap gap-2">
                  {BRAND_OPTIONS.map(brand => (
                    <button
                      key={brand}
                      onClick={() => toggleArrayFilter('brands', brand)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.brands.includes(brand)
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleArrayFilter('sizes', size)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.sizes.includes(size)
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONDITION_OPTIONS.map(condition => (
                    <button
                      key={condition}
                      onClick={() => toggleArrayFilter('conditions', condition)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.conditions.includes(condition)
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marketplaces */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketplaces
                </label>
                <div className="flex flex-wrap gap-2">
                  {MARKETPLACE_OPTIONS.map(marketplace => (
                    <button
                      key={marketplace}
                      onClick={() => toggleArrayFilter('marketplaces', marketplace)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors capitalize ${
                        filters.marketplaces.includes(marketplace)
                          ? 'bg-purple-100 border-purple-300 text-purple-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {marketplace}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            {hasActiveFilters && (
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all filters
                </button>
                <div className="text-sm text-gray-600">
                  {[...filters.brands, ...filters.sizes, ...filters.conditions, ...filters.marketplaces].length + (filters.priceMin || filters.priceMax ? 1 : 0)} filters active
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {loading && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="max-w-6xl mx-auto text-center text-blue-700">
            Searching...
          </div>
        </div>
      )}
    </div>
  );
}
