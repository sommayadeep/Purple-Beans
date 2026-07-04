import { create } from "zustand";
import { Product } from "@/data/products";


export interface CartItem {
  product: Product;
  quantity: number;
  grind: string;
  weight: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number, grind?: string, weight?: string) => void;
  removeItem: (productId: string, grind: string, weight: string) => void;
  updateQuantity: (productId: string, grind: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  (set, get) => ({
    items: [],
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    addItem: (product, quantity = 1, grind = "Whole Bean", weight = "250g") => {
      const currentItems = get().items;
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.grind === grind &&
          item.weight === weight
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        set({ items: updatedItems });
      } else {
        set({ items: [...currentItems, { product, quantity, grind, weight }] });
      }
    },
    removeItem: (productId, grind, weight) => {
      set({
        items: get().items.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.grind === grind &&
              item.weight === weight
            )
        ),
      });
    },
    updateQuantity: (productId, grind, weight, quantity) => {
      if (quantity <= 0) {
        get().removeItem(productId, grind, weight);
        return;
      }
      set({
        items: get().items.map((item) =>
          item.product.id === productId &&
          item.grind === grind &&
          item.weight === weight
            ? { ...item, quantity }
            : item
        ),
      });
    },
    clearCart: () => set({ items: [] }),
    getTotalItems: () => {
      return get().items.reduce((total, item) => total + item.quantity, 0);
    },
    getTotalPrice: () => {
      return get().items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    },
  })
);

