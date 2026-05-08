"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Minus, Plus, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

export default function ProductDetail({ params }) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await apiFetch(`/api/products/${unwrappedParams.id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cobalt" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-cobalt mb-4">Product Not Found</h1>
        <Link href="/">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-cobalt font-bold mb-8 transition-colors">
        <ArrowLeft size={20} />
        <span>Back to products</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-sm border border-border">
          <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized={true} />
        </div>

        <div className="flex flex-col">
          <Badge variant="accent" className="w-fit mb-4 uppercase tracking-wider">{product.category.replace('-', ' ')}</Badge>
          <h1 className="text-4xl md:text-5xl font-black font-display text-cobalt mb-2">{product.name}</h1>
          <p className="text-muted font-bold mb-6">Ages {product.age_range}</p>
          <div className="text-4xl font-mono font-black text-cobalt mb-6">${product.price.toFixed(2)}</div>
          
          <div className="mb-8">
            {product.stock > 0 ? (
              <Badge variant="success">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="danger">Out of Stock</Badge>
            )}
          </div>
          
          <p className="text-charcoal/80 leading-relaxed mb-10 text-lg">{product.description}</p>
          
          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-bold text-charcoal">Quantity</span>
              <div className="flex items-center border border-border rounded-xl bg-white overflow-hidden shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted hover:text-cobalt"><Minus size={20} /></button>
                <span className="w-12 text-center font-mono font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock} className="p-3 text-muted hover:text-cobalt"><Plus size={20} /></button>
              </div>
            </div>
            <Button className="w-full text-lg py-4" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
