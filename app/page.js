"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { mockCategories } from '@/lib/mock-data';
import { apiFetch } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          category: activeCategory,
          sort: sortBy,
          search: searchTerm
        }).toString();
        const response = await apiFetch(`/api/products?${query}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, sortBy, searchTerm]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cobalt text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black font-display mb-4">
            Discover Toys They'll Love
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            From educational kits to action figures, find the perfect gift to spark joy and imagination.
          </p>
          <div className="max-w-xl mx-auto relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search for toys..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow text-white placeholder-white/50"
            />
            <Search className="absolute left-4 top-3.5 text-white/50" size={20} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
          <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                  activeCategory === cat.id 
                    ? 'bg-cobalt text-white' 
                    : 'bg-white text-cobalt border border-cobalt hover:bg-cobalt/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto bg-white border border-border rounded-xl px-4 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cobalt/20"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cobalt" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="text-xl font-bold">No products found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
