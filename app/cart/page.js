"use client";

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import CartItem from '@/components/cart/CartItem';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag size={40} className="text-muted" />
        </div>
        <h1 className="text-3xl font-black font-display text-cobalt mb-4">Your cart is empty</h1>
        <p className="text-muted mb-8">Looks like you haven't added any toys yet.</p>
        <Link href="/">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <h1 className="text-3xl font-black font-display text-cobalt mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-2 sm:p-6 shadow-sm border border-border">
            {items.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-border sticky top-24">
            <h2 className="text-xl font-bold font-display text-cobalt mb-6 pb-4 border-b border-border">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-charcoal">
                <span>Subtotal</span>
                <span className="font-mono font-bold">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Shipping</span>
                <span className="text-muted text-sm">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between text-xl font-black font-display text-cobalt border-t border-border pt-4 mb-8">
              <span>Total</span>
              <span className="font-mono">${totalPrice().toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" className="block">
              <Button className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
