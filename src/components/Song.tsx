import Link from 'next/link';

interface Props {
  product: {
    id: string;
    img: string;
    name: string;
    price: string;
  }
  handleAddToCart: (id: string) => void;
}

export default function Song({ product, handleAddToCart }: Props) {
  return (
    <div
      key={product.id}
      className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-indigo-500/50 hover:bg-zinc-900 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <Link href={`/products/${product.id}`} className="block cursor-pointer">
        <img
          src={product.img}
          alt={product.name}
          className="w-full aspect-video object-cover"
        />
        <div className="p-5">
          <h3 className="font-bold text-xl tracking-tight text-zinc-100 group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent">
              {product.price} ₽
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(product.id);
              }}
              className="relative z-9 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer pointer-events-auto"
            >
              В корзину
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
