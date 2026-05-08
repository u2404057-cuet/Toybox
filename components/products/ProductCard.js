import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          unoptimized={true}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock === 0 ? (
            <Badge variant="danger">Out of Stock</Badge>
          ) : (
            <Badge variant="success">In Stock</Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-cobalt truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-sm text-muted mt-1 flex justify-between items-center">
            <span>Ages {product.ageRange}</span>
            <span className="font-mono text-lg font-bold text-cobalt">${product.price.toFixed(2)}</span>
          </p>
        </div>
        
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock === 0}
          className="w-full mt-2"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  );
}
