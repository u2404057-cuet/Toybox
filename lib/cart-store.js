import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product_id === product.id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { 
              product_id: product.id, 
              name: product.name, 
              price: product.price, 
              image: product.image, 
              quantity: 1 
            }],
          });
        }
      },
      removeItem: (product_id) => {
        set({
          items: get().items.filter((item) => item.product_id !== product_id),
        });
      },
      updateQty: (product_id, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map((item) =>
            item.product_id === product_id ? { ...item, quantity: qty } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'toybox-cart',
    }
  )
);
