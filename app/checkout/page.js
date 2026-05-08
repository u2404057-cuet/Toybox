"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!isLoggedIn) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Simulate order placement
    setTimeout(() => {
      setOrderId('ORD-' + Math.floor(Math.random() * 1000000));
      setIsSuccess(true);
      clearCart();
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-success" />
        </div>
        <h1 className="text-4xl font-black font-display text-cobalt mb-2">Order Placed!</h1>
        <p className="text-muted mb-6">Thank you for your purchase.</p>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-8">
          <p className="text-sm text-muted mb-1">Your Order ID</p>
          <p className="font-mono font-bold text-xl text-charcoal">{orderId}</p>
        </div>
        <Link href="/orders">
          <Button size="lg" className="w-full">View My Orders</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-cobalt mb-4">Your cart is empty</h1>
        <Link href="/">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <h1 className="text-3xl font-black font-display text-cobalt mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border">
            <h2 className="text-xl font-bold font-display text-cobalt mb-6 pb-4 border-b border-border">
              Shipping Details
            </h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <Input 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Email Address" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Phone Number" 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-charcoal">Shipping Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cobalt/20 focus:border-cobalt transition-all resize-none"
                />
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border sticky top-24">
            <h2 className="text-xl font-bold font-display text-cobalt mb-6 pb-4 border-b border-border">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.product_id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-charcoal text-sm">{item.name}</h4>
                    <p className="text-muted text-xs">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-mono font-bold text-cobalt text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-4 mb-8">
              <div className="flex justify-between text-charcoal">
                <span>Subtotal</span>
                <span className="font-mono font-bold">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Shipping</span>
                <span className="font-mono font-bold">Free</span>
              </div>
              <div className="flex justify-between text-xl font-black font-display text-cobalt pt-4 border-t border-border">
                <span>Total</span>
                <span className="font-mono">${totalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              form="checkout-form" 
              size="lg" 
              className="w-full"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
