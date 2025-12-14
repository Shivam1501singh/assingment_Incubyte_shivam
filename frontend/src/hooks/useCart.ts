import { useState } from 'react';
import { Sweet } from '@/types/sweet';

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (sweet: Sweet) => {
    setItems(prev => {
      const existing = prev.find(item => item.sweet.id === sweet.id);
      if (existing) {
        return prev.map(item => 
          item.sweet.id === sweet.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { sweet, quantity: 1 }];
    });
  };

  const removeFromCart = (sweetId: string) => {
    setItems(prev => prev.filter(item => item.sweet.id !== sweetId));
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }
    setItems(prev => 
      prev.map(item => 
        item.sweet.id === sweetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount };
};
