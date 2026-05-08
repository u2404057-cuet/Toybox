"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({ children }) {
  const { isAdmin, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="animate-spin text-cobalt" size={48} />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-cobalt text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="font-display text-2xl font-black tracking-tight">
            <span className="text-white">Toy</span>
            <span className="text-yellow">Box</span>
            <span className="text-xs tracking-normal font-sans ml-2 text-white/70">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-bold">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
            <Package size={20} />
            <span className="font-bold">Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
            <ShoppingBag size={20} />
            <span className="font-bold">Orders</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-3 w-full px-4 py-3 text-coral hover:bg-white/10 rounded-xl transition-colors font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Admin Content */}
      <main className="flex-1 overflow-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}
