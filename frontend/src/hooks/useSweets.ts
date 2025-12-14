import { useState, useEffect } from 'react';
import { Sweet } from '@/types/sweet';

const getAuthHeaders = () => {
  const token = localStorage.getItem('sweetshop_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const transformSweet = (sweet: any): Sweet => ({
  id: sweet._id,
  name: sweet.name,
  category: sweet.category,
  price: sweet.price,
  stock: sweet.quantity,
  description: sweet.description || '',
  createdAt: sweet.createdAt,
});

export const useSweets = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSweets = async () => {
    try {
      const response = await fetch('/api/sweets', {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const transformed = data.map(transformSweet);
        setSweets(transformed);
      } else {
        console.error('Failed to fetch sweets');
      }
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const addSweet = async (sweet: Omit<Sweet, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/sweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: sweet.name,
          category: sweet.category,
          price: sweet.price,
          quantity: sweet.stock,
          description: sweet.description,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const newSweet = transformSweet(data);
        setSweets(prev => [...prev, newSweet]);
      }
    } catch (error) {
      console.error('Error adding sweet:', error);
    }
  };

  const updateSweet = async (id: string, updates: Partial<Sweet>) => {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.category) updateData.category = updates.category;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.stock !== undefined) updateData.quantity = updates.stock;
      if (updates.description !== undefined) updateData.description = updates.description;

      const response = await fetch(`/api/sweets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        const data = await response.json();
        const updatedSweet = transformSweet(data);
        setSweets(prev => prev.map(s => s.id === id ? updatedSweet : s));
      }
    } catch (error) {
      console.error('Error updating sweet:', error);
    }
  };

  const deleteSweet = async (id: string) => {
    try {
      const response = await fetch(`/api/sweets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setSweets(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting sweet:', error);
    }
  };

  const updateSweetLocal = (id: string, updates: Partial<Sweet>) => {
    setSweets(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const lowStockSweets = sweets.filter(s => s.stock <= 10);

  return { sweets, addSweet, updateSweet, deleteSweet, updateSweetLocal, lowStockSweets, loading };
};
