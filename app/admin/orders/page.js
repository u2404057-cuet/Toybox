"use client";

import { useState, useEffect } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import Badge from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/admin/orders');
      const mappedOrders = response.data.map(o => ({
        id: o._id.toString(),
        customer: o.user_id?.name || 'Guest',
        date: new Date(o.createdAt).toISOString().split('T')[0],
        total: o.total,
        status: o.status.toLowerCase()
      }));
      setOrders(mappedOrders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex >= statuses.length - 1) {
      toast.error('Order is already delivered!');
      return;
    }
    
    const newStatus = statuses[currentIndex + 1];
    // Capitalize for backend
    const backendStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    
    try {
      await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: backendStatus })
      });
      toast.success(`Order status updated to ${backendStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-display text-cobalt mb-1">Orders</h1>
        <p className="text-muted">Manage and track customer orders.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full font-bold text-sm capitalize transition-colors ${
              filter === status 
                ? 'bg-cobalt text-white' 
                : 'bg-white text-cobalt border border-cobalt hover:bg-cobalt/5'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-cobalt" size={48} />
        </div>
      ) : (
        <OrderTable 
          orders={filteredOrders} 
          onView={(order) => handleUpdateStatus(order.id, order.status)} 
        />
      )}
    </div>
  );
}
