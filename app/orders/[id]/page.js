"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

// Mock order details
const mockOrderDetails = {
  id: 'ORD-12345',
  date: 'May 1, 2024',
  status: 'delivered',
  shippingAddress: 'Nahim Rahim, 123 Play Street, Fun City, 10001',
  items: [
    { name: 'Galactic Space Cruiser', quantity: 1, price: 49.99 },
    { name: 'Super Hero Action Figure', quantity: 1, price: 19.99 },
  ],
  subtotal: 69.98,
  shipping: 0,
  total: 69.98
};

export default function OrderDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(mockOrderDetails);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/orders');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!isLoggedIn) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={20} />;
      case 'processing': return <Package size={20} />;
      case 'shipped': return <Truck size={20} />;
      case 'delivered': return <CheckCircle2 size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'accent';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Link href="/orders" className="inline-flex items-center gap-2 text-muted hover:text-cobalt font-bold mb-8 transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Order History</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black font-display text-cobalt mb-1">
              Order Details
            </h1>
            <p className="text-muted font-mono text-sm">{order.id} • {order.date}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-border">
            <span className={`text-${getStatusVariant(order.status)}`}>
              {getStatusIcon(order.status)}
            </span>
            <span className="font-bold text-charcoal capitalize">{order.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 bg-cream rounded-2xl border border-border">
            <h3 className="font-bold text-cobalt mb-3">Shipping Address</h3>
            <p className="text-charcoal leading-relaxed">{order.shippingAddress}</p>
          </div>
          <div className="p-6 bg-cream rounded-2xl border border-border">
            <h3 className="font-bold text-cobalt mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-mono font-bold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-mono font-bold">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black font-display text-cobalt pt-2 border-t border-border/50">
                <span>Total</span>
                <span className="font-mono">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 font-bold text-cobalt text-sm uppercase">Product</th>
                <th className="pb-4 font-bold text-cobalt text-sm uppercase text-center">Qty</th>
                <th className="pb-4 font-bold text-cobalt text-sm uppercase text-right">Unit Price</th>
                <th className="pb-4 font-bold text-cobalt text-sm uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 font-bold text-charcoal">{item.name}</td>
                  <td className="py-4 text-center font-mono">{item.quantity}</td>
                  <td className="py-4 text-right font-mono">${item.price.toFixed(2)}</td>
                  <td className="py-4 text-right font-mono font-bold text-cobalt">
                    ${(item.price * item.quantity).toFixed(2)}
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
