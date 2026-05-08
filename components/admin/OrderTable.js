import Badge from '../ui/Badge';
import { Eye } from 'lucide-react';

export default function OrderTable({ orders, onView }) {
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
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-border">
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Order ID</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Customer</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Date</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Total</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase">Status</th>
              <th className="px-6 py-4 font-bold text-cobalt text-xs uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono font-bold text-charcoal">{order.id}</td>
                <td className="px-6 py-4 text-charcoal">{order.customer}</td>
                <td className="px-6 py-4 text-muted">{order.date}</td>
                <td className="px-6 py-4 font-mono font-bold text-cobalt">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(order.status)} className="capitalize">
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onView(order)}
                    className="p-2 text-muted hover:text-cobalt hover:bg-cobalt/5 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
