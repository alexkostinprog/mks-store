'use client';

import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { CheckCircle2, ShoppingCart } from 'lucide-react';

interface Props {
  product: any;
}

export default function AddToCartButton({ product }: Props) {
  const { updateCart, products } = useCartStore();

  // src/components/AddToCartButton.tsx

  const handleAdd = async () => {
    try {
      // ВАЖНО: Мы передаем текущий продукт в массиве,
      // чтобы стор мог взять из него name, price и img
      await updateCart(product.id, 1, [product]);

      toast.success('Добавлено', {
        description: `«${product.name}» теперь в корзине`,
        icon: <CheckCircle2 className="text-indigo-500" size={20} />,
        style: {
          background: '#18181b', // zinc-900
          border: '1px solid #27272a', // zinc-800
          color: '#f4f4f5', // zinc-100
        },
        className: 'font-sans border-l-4 border-l-indigo-600', // синяя полоска слева
      });
    } catch (e) {
      toast.error('Нужно войти в аккаунт');
    }
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
    >
      <ShoppingCart size={22} />
      Добавить в корзину
    </button>
  );
}
