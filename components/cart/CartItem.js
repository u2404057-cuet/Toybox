import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-border">
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className="object-cover rounded-xl"
        />
      </div>
      
      <div className="flex-grow flex flex-col items-center sm:items-start text-center sm:text-left w-full">
        <h3 className="font-bold text-cobalt text-lg">{item.name}</h3>
        <p className="font-mono text-muted mt-1">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button 
            onClick={() => updateQty(item.product_id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 text-muted hover:text-cobalt disabled:opacity-50 transition-colors bg-cream"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-mono font-bold text-charcoal">{item.quantity}</span>
          <button 
            onClick={() => updateQty(item.product_id, item.quantity + 1)}
            className="p-2 text-muted hover:text-cobalt transition-colors bg-cream"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="w-20 text-right">
          <span className="font-mono font-bold text-cobalt">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => removeItem(item.product_id)}
          className="p-2 text-muted hover:text-coral transition-colors"
          title="Remove item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
