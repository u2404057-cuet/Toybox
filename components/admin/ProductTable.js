import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete }) {

  products.map(pro => console.log(pro.images[0]));
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Product</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Category</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Price</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Stock</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <span className="font-bold text-charcoal truncate max-w-[200px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted capitalize">{product.category.replace('-', ' ')}</span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-cobalt">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${product.stock < 5 ? 'text-coral' : 'text-charcoal'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-2 text-muted hover:text-cobalt hover:bg-cobalt/5 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(product.id)}
                      className="p-2 text-muted hover:text-coral hover:bg-coral/5 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
