"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Badge from '@/components/ui/Badge';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';

// Mock orders for UI
const mockOrders = [
  { id: 'ORD-12345', date: '2024-05-01', total: 69.98, status: 'delivered' },
  { id: 'ORD-67890', date: '2024-05-05', total: 24.99, status: 'shipped' },
  { id: 'ORD-11223', date: '2024-05-07', total: 89.99, status: 'processing' },
];

export default function OrdersPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(mockOrders);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/orders');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!isLoggedIn) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'accent';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
          <ShoppingBag size={40} className="text-muted" />
        </div>
        <h1 className="text-3xl font-black font-display text-cobalt mb-4">No orders yet</h1>
        <p className="text-muted mb-8">Start shopping to see your orders here!</p>
        <Link href="/">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <h1 className="text-3xl font-black font-display text-cobalt mb-8">Order History</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 font-bold text-cobalt uppercase text-xs tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-bold text-cobalt uppercase text-xs tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold text-cobalt uppercase text-xs tracking-wider">Total</th>
                <th className="px-6 py-4 font-bold text-cobalt uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-cobalt uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-charcoal">{order.id}</td>
                  <td className="px-6 py-4 text-muted">{order.date}</td>
                  <td className="px-6 py-4 font-mono font-bold text-cobalt">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-cobalt hover:text-yellow transition-colors"
                    >
                      View Details <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
