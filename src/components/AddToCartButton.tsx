'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { CheckCircle2, ShoppingCart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  product: any;
}

export default function AddToCartButton({ product }: Props) {
  const [isAdded, setIsAdded] = useState(false);
  const { updateCart, products } = useCartStore();

  // src/components/AddToCartButton.tsx

  const handleAdd = () => {
    try {
      // ВАЖНО: Мы передаем текущий продукт в массиве,
      // чтобы стор мог взять из него name, price и img
      updateCart(product.id, 1, [product]);
      setIsAdded(true);
      // Возвращаем текст кнопки через 2 секунды
      setTimeout(() => setIsAdded(false), 2000);

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
      disabled={isAdded}
      className={`
        relative overflow-hidden px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3
        ${
          isAdded
            ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
        }
      `}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={20} strokeWidth={3} />
            <span>В корзине!</span>
          </motion.div>
        ) : (
          <motion.div
            key="cart"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <span>Добавить в корзину</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Эффект всплеска (Ripple) при клике */}
      {isAdded && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          className="absolute inset-0 bg-white rounded-full"
        />
      )}
    </button>
  );
}
