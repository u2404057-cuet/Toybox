"use client";

import { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import ProductTable from '@/components/admin/ProductTable';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { mockCategories } from '@/lib/mock-data';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ orders_today: 0, total_revenue: 0, low_stock: [] });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'action-figures', price: '', stock: '', description: '', image: ''
  });

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: product.image
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      });
      toast.success('Product updated!');
      setIsModalOpen(false);
      fetchData(); // Refresh the dashboard data!
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        toast.success('Product deleted!');
        fetchData(); // Refresh dashboard
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

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
        </div>
        <ProductTable 
          products={lowStockProducts} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Edit Low Stock Product"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Product Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-charcoal">Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
              className="px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cobalt/20"
            >
              {mockCategories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Price ($)" 
              type="number" 
              step="0.01" 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
              required 
            />
            <Input 
              label="Stock" 
              type="number" 
              value={formData.stock} 
              onChange={(e) => setFormData({...formData, stock: e.target.value})} 
              required 
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
