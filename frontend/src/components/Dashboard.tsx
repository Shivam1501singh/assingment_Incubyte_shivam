import { useState, useMemo } from 'react';
import { Sweet, User } from '@/types/sweet';
import { useSweets } from '@/hooks/useSweets';
import { useCart } from '@/hooks/useCart';
import { SweetCard } from './SweetCard';
import { SweetForm } from './SweetForm';
import { Cart } from './Cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Candy, LogOut, Plus, Search, AlertTriangle, Package, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { sweets, addSweet, updateSweet, deleteSweet, updateSweetLocal, lowStockSweets } = useSweets();
  const cart = useCart();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editSweet, setEditSweet] = useState<Sweet | null>(null);

  const categories = useMemo(() => 
    ['all', ...new Set(sweets.map(s => s.category))], 
    [sweets]
  );

  const filteredSweets = useMemo(() => {
    return sweets.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                           s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [sweets, search, categoryFilter]);

  const totalValue = sweets.reduce((sum, s) => sum + (s.price * s.stock), 0);
  const isAdmin = user.role === 'admin';

  const handleAddSweet = async (data: Omit<Sweet, 'id' | 'createdAt'>) => {
    await addSweet(data);
    toast({ title: 'Success', description: 'Sweet added successfully!' });
  };

  const handleUpdateSweet = async (data: Omit<Sweet, 'id' | 'createdAt'>) => {
    if (editSweet) {
      await updateSweet(editSweet.id, data);
      toast({ title: 'Success', description: 'Sweet updated successfully!' });
    }
    setEditSweet(null);
  };

  const handleDelete = async (id: string) => {
    await deleteSweet(id);
    toast({ title: 'Deleted', description: 'Sweet removed from inventory' });
  };

  const handleRemoveFromCart = (sweetId: string) => {
    const item = cart.items.find(i => i.sweet.id === sweetId);
    if (item) {
      updateSweetLocal(sweetId, { stock: sweets.find(s => s.id === sweetId)!.stock + item.quantity });
    }
    cart.removeFromCart(sweetId);
  };

  const handleUpdateQuantity = (sweetId: string, newQuantity: number) => {
    const item = cart.items.find(i => i.sweet.id === sweetId);
    if (item) {
      const diff = newQuantity - item.quantity;
      updateSweetLocal(sweetId, { stock: sweets.find(s => s.id === sweetId)!.stock - diff });
    }
    cart.updateQuantity(sweetId, newQuantity);
  };

  const handleCheckout = async () => {
    // Validate stock
    for (const item of cart.items) {
      const currentSweet = sweets.find(s => s.id === item.sweet.id);
      if (!currentSweet || currentSweet.stock < item.quantity) {
        toast({ 
          title: 'Error', 
          description: `Not enough stock for ${item.sweet.name}`,
          variant: 'destructive'
        });
        return false;
      }
    }
    // Purchase items
    try {
      for (const item of cart.items) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sweets/${item.sweet.id}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('sweetshop_token')}`,
          },
          body: JSON.stringify({ amount: item.quantity }),
        });
        if (!response.ok) {
          throw new Error(`Failed to purchase ${item.sweet.name}`);
        }
      }
      // Update local stock
      for (const item of cart.items) {
        updateSweetLocal(item.sweet.id, { stock: sweets.find(s => s.id === item.sweet.id)!.stock - item.quantity });
      }
      cart.clearCart();
      return true;
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Checkout failed. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Candy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sweet Shop</h1>
              <p className="text-xs text-muted-foreground">Welcome, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Cart 
              items={cart.items}
              total={cart.total}
              itemCount={cart.itemCount}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveFromCart}
              onCheckout={handleCheckout}
            />
            <Badge variant="outline" className="capitalize">{user.role}</Badge>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sweets.length}</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className={`border-0 backdrop-blur ${lowStockSweets.length > 0 ? 'bg-amber-50' : 'bg-card/60'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className={`w-4 h-4 ${lowStockSweets.length > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lowStockSweets.length}</div>
              {lowStockSweets.length > 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  {lowStockSweets.map(s => s.name).join(', ')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sweets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isAdmin && (
            <Button onClick={() => setFormOpen(true)} className="bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600">
              <Plus className="w-4 h-4 mr-1" /> Add Sweet
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map(sweet => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onEdit={(s) => { setEditSweet(s); setFormOpen(true); }}
              onDelete={handleDelete}
              onAddToCart={(s) => { if (s.stock > 0) { cart.addToCart(s); updateSweetLocal(s.id, { stock: s.stock - 1 }); } }}
              canEdit={isAdmin}
              isInCart={cart.items.some(item => item.sweet.id === sweet.id)}
            />
          ))}
        </div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Candy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sweets found</p>
          </div>
        )}
      </main>

      <SweetForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditSweet(null); }}
        onSubmit={editSweet ? handleUpdateSweet : handleAddSweet}
        editSweet={editSweet}
      />
    </div>
  );
};
