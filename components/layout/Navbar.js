"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/hooks/useAuth';
import Button from '../ui/Button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const { isLoggedIn, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white shadow-sm' : 'bg-cream'} border-b border-gray-100 h-16`}>
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-black tracking-tight shrink-0">
          <span className="text-cobalt">Toy</span>
          <span className="text-yellow">Box</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search for toys..." 
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cobalt/20 transition-all text-charcoal"
            />
            <Search className="absolute left-3 top-2.5 text-muted" size={18} />
          </div>
        </div>

        {/* Desktop Right Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {isAdmin && (
            <Link href="/admin" className="text-sm font-bold text-cobalt hover:text-yellow transition-colors">
              Admin
            </Link>
          )}
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-charcoal hover:text-cobalt transition-colors font-bold">
                  <User size={20} />
                  <span>Account</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50 hover:text-cobalt">Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-50 hover:text-cobalt">Orders</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-coral hover:bg-red-50">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" className="py-2 px-4">Login</Button>
              </Link>
            )}
            
            <Link href="/cart" className="relative p-2 text-charcoal hover:text-cobalt transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-yellow text-cobalt text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative p-2 text-charcoal">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-yellow text-cobalt text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
          <button 
            className="p-2 text-charcoal"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-b border-border py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search for toys..." 
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cobalt/20"
            />
            <Search className="absolute left-3 top-2.5 text-muted" size={18} />
          </div>
          
          <nav className="flex flex-col gap-2 mt-2">
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 font-bold text-cobalt border-b border-gray-100">
                Admin Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 font-bold text-charcoal">Profile</Link>
                <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 font-bold text-charcoal">Orders</Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block py-2 text-left font-bold text-coral">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 font-bold text-cobalt">Login</Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 font-bold text-charcoal">Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
