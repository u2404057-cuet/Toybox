"use client";

import { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import ProductTable from '@/components/admin/ProductTable';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders_today: 0, total_revenue: 0, low_stock: [] });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, productsRes] = await Promise.all([
          apiFetch('/api/admin/dashboard'),
          apiFetch('/api/products')
        ]);
        setStats(statsRes.data);
        setLowStockProducts(productsRes.data.filter(p => p.stock < 10));
      } catch (error) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cobalt" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-display text-cobalt mb-2">Admin Dashboard</h1>
        <p className="text-muted">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Today's Orders" value={(stats.orders_today || 0).toString()} variant="primary" />
        <StatCard title="Total Revenue" value={`$${(stats.total_revenue || 0).toFixed(2)}`} variant="accent" />
        <StatCard title="Low Stock Items" value={((stats.low_stock && stats.low_stock.length) || 0).toString()} variant="danger" />
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-display text-cobalt">Low Stock Alert</h2>
          <Link href="/admin/products" className="text-sm font-bold text-cobalt hover:text-yellow flex items-center gap-1 transition-colors">
            Manage Products <ArrowRight size={16} />
          </Link>
        </div>
        <ProductTable products={lowStockProducts} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </div>
  );
}
