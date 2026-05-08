"use client";

import { useState } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import Badge from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

const mockAdminOrders = [
  { id: 'ORD-12345', customer: 'John Doe', date: '2024-05-01', total: 69.98, status: 'delivered' },
  { id: 'ORD-67890', customer: 'Jane Smith', date: '2024-05-05', total: 24.99, status: 'shipped' },
  { id: 'ORD-11223', customer: 'Bob Johnson', date: '2024-05-07', total: 89.99, status: 'processing' },
  { id: 'ORD-44556', customer: 'Alice Brown', date: '2024-05-08', total: 19.99, status: 'pending' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(mockAdminOrders);
  const [filter, setFilter] = useState('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
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

      <OrderTable 
        orders={filteredOrders} 
        onView={(order) => {
          const statuses = ['pending', 'processing', 'shipped', 'delivered'];
          const currentIndex = statuses.indexOf(order.status);
          if (currentIndex < statuses.length - 1) {
            handleUpdateStatus(order.id, statuses[currentIndex + 1]);
          } else {
            toast.error('Order is already delivered!');
          }
        }} 
      />
    </div>
  );
}
