'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const QuickCart = ({ onCheckout }: { onCheckout: () => void }) => {
  const { totalItems, totalAmount } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transform rounded-2xl border border-emerald-500 bg-emerald-50/90 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center border-none bg-indigo-600 p-0 text-[10px] font-bold text-white">
              {totalItems}
            </Badge>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/60">Your Order</p>
            <p className="text-xl font-black text-emerald-600 leading-none">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all px-6 font-bold"
          onClick={onCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
