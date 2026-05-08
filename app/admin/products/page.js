"use client";

import { useState, useEffect } from 'react';
import ProductTable from '@/components/admin/ProductTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { mockCategories } from '@/lib/mock-data';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'action-figures',
    price: '',
    stock: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'action-figures',
        price: '',
        stock: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      
      await apiFetch(url, {
        method,
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          age_range: '3+'
        })
      });

      toast.success(editingProduct ? 'Product updated!' : 'Product added!');
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        toast.success('Product deleted!');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-display text-cobalt mb-1">Products</h1>
          <p className="text-muted">Manage your store's inventory.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} /> Add New Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-cobalt" size={48} />
        </div>
      ) : (
        <ProductTable 
          products={products} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-charcoal">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
              rows={3} 
              className="px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cobalt/20 resize-none" 
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={submitting}>
            {submitting ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Add Product')}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
