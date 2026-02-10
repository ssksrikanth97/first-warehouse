'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { items, updateQuantity, totalAmount, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);

  const handlePlaceOrder = () => {
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        {isOrdered ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-4 rounded-full bg-emerald-100 p-3 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">Order Placed!</DialogTitle>
            <DialogDescription className="mt-2 text-slate-500">
              Your wholesale order is being sent to the distributor.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                Your Cart
              </DialogTitle>
              <DialogDescription>
                Review your items before placing the order.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="mt-4 max-h-[50vh] pr-4">
              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-500">Your cart is empty</p>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">₹{item.wholesalePrice} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border bg-slate-50 p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-indigo-600"
                          onClick={() => updateQuantity(item.id, item.quantity - item.minOrderQuantity)}
                        >
                          -
                        </Button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-indigo-600"
                          onClick={() => updateQuantity(item.id, item.quantity + item.minOrderQuantity)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-600">Total Amount</span>
                <span className="text-xl text-indigo-600">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Continue Shopping
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={handlePlaceOrder}
                disabled={items.length === 0}
              >
                Place Order (Pay Later)
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
