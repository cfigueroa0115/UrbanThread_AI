import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  pendingCheckout: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  setPendingCheckout: (pending: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      pendingCheckout: false,

      addItem: (item) => {
        const key = `${item.id}|${item.size ?? ''}|${item.color ?? ''}`;
        const existing = get().items.find(
          (i) => `${i.id}|${i.size ?? ''}|${i.color ?? ''}` === key
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              `${i.id}|${i.size ?? ''}|${i.color ?? ''}` === key
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
        set({ isOpen: true });
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => `${i.id}|${i.size ?? ''}|${i.color ?? ''}` !== key) });
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => `${i.id}|${i.size ?? ''}|${i.color ?? ''}` !== key) });
        } else {
          set({
            items: get().items.map((i) => (`${i.id}|${i.size ?? ''}|${i.color ?? ''}` === key ? { ...i, quantity } : i)),
          });
        }
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      setPendingCheckout: (pending) => set({ pendingCheckout: pending }),
    }),
    { name: 'urbanthread-cart', partialize: (state) => ({ items: state.items, pendingCheckout: state.pendingCheckout }) }
  )
);
