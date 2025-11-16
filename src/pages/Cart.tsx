import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  platform: string;
  price: number;
  quantity: number;
}

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } else {
      setCartItems(data || []);
    }
    setLoading(false);
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } else {
      setCartItems(cartItems.filter((item) => item.id !== id));
      toast({ title: "Item removed from cart" });
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    setPlacing(true);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { error } = await supabase.from("orders").insert([{
      user_id: user?.id as string,
      items: cartItems as any,
      total,
      status: "completed",
    }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
      setPlacing(false);
      return;
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", user?.id);

    toast({
      title: "Order placed successfully! 🎉",
      description: `Your order of ₹${total.toLocaleString()} has been confirmed.`,
    });

    setCartItems([]);
    setPlacing(false);
    navigate("/");
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <div className="container px-4 py-8 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <main className="container px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some products to get started!</p>
            <Button onClick={() => navigate("/")}>Browse Products</Button>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex gap-4">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2">{item.product_name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{item.platform}</p>
                      <p className="text-lg font-bold text-primary mt-2">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items</span>
                      <span>{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={placeOrder}
                    disabled={placing}
                  >
                    {placing ? "Placing Order..." : "Place Order"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    You'll be redirected to the seller's website to complete your purchase
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
