import { CartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface CartProps {
  items: CartItem[];
  total: number;
  itemCount: number;
  onUpdateQuantity: (sweetId: string, quantity: number) => void;
  onRemove: (sweetId: string) => void;
  onCheckout: () => boolean;
}

export const Cart = ({ items, total, itemCount, onUpdateQuantity, onRemove, onCheckout }: CartProps) => {
  const [open, setOpen] = useState(false);

  const handleCheckout = async () => {
    const success = await onCheckout();
    if (success) {
      toast({
        title: "Purchase Complete!",
        description: `Successfully purchased ${itemCount} items for $${total.toFixed(2)}`,
      });
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ sweet, quantity }) => (
                <div key={sweet.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-200 via-purple-200 to-amber-200 flex items-center justify-center text-2xl">
                    🍬
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{sweet.name}</p>
                    <p className="text-sm text-muted-foreground">${sweet.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(sweet.id, quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(sweet.id, quantity + 1)}
                      disabled={quantity >= sweet.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => onRemove(sweet.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                <CheckCircle className="w-5 h-5 mr-2" />
                Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
