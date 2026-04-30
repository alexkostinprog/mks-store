import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

interface CartStore {
  products: any[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  updateCart: (productId: string, delta: number, allProducts: any[]) => void;
  clearCart: () => Promise<void>;
  checkout: (email: string) => Promise<void>;
  setProducts: (products: any[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      products: [],
      setProducts: (products) => set({ products }),
      cart: [],
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      updateCart: (productId, delta, allProducts) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === productId);

        if (existingItem) {
          // ЕСЛИ ТОВАР УЖЕ ЕСТЬ: просто меняем количество.
          // Нам НЕ НУЖЕН allProducts, не нужно ничего искать в БД.
          const newCart = cart
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                : item,
            )
            .filter((item) => item.quantity > 0);

          set({ cart: newCart });
        } else {
          // ЕСЛИ ТОВАРА НЕТ: только тогда ищем его в пришедшем списке
          const productInfo = allProducts?.find((p) => p.id === productId);

          if (productInfo) {
            set({ cart: [...cart, { ...productInfo, quantity: 1 }] });
          }
        }
      },

      clearCart: async () => {
        try {
          await axios.delete('/api/cart'); // Создадим этот метод в роуте
          set({ cart: [] });
          toast.success('Корзина очищена', {
            description: 'Можно собирать новый заказ',
            icon: <CheckCircle2 className="text-indigo-500" size={20} />,
            style: {
              background: '#18181b', // zinc-900
              border: '1px solid #27272a', // zinc-800
              color: '#f4f4f5', // zinc-100
            },
            className: 'font-sans border-l-4 border-l-indigo-600', // синяя полоска слева
          });
        } catch (e) {
          toast.error('Ошибка при очистке');
        }
      },

      checkout: async (email: string) => {
        const { cart } = get();
        if (cart.length === 0) return;

        try {
          const { data } = await axios.post('/api/checkout', {
            items: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
            email: email,
          });

          if (data.url) {
            set({ isCartOpen: false });
            window.location.href = data.url; // Редирект на оплату
          }
        } catch (error: any) {
          const message =
            error.response?.data?.message || 'Ошибка при создании заказа';
          throw new Error(message);
        }
      },
    }),
    {
      name: 'mks-cart-storage', // Ключ, по которому корзина будет лежать в браузере
      skipHydration: true,
    },
  ),
);
