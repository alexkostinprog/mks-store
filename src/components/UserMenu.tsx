'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, ShoppingBag, ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all"
      >
        <div className="bg-indigo-600 p-1.5 rounded-full text-white">
          <User size={18} />
        </div>
        <ChevronDown
          size={14}
          className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-100">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-zinc-200 truncate">
              {user?.email}
            </p>
          </div>
          <div className="p-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:bg-indigo-600 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={16} /> Мои заказы
            </Link>
          </div>
          <div className="p-1 border-t border-zinc-800">
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              <LogOut size={16} /> Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
