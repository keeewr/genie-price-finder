import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, TrendingDown, ShoppingCart, Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface Price {
  platform: string;
  price: number;
  url: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  prices: Price[];
}

interface ProductCardProps {
  product: Product;
}

const platformColors: Record<string, string> = {
  amazon: "bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-400",
  flipkart: "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400",
  tira: "bg-pink-100 text-pink-900 dark:bg-pink-900/20 dark:text-pink-400",
  myntra: "bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-400",
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const availablePrices = product.prices.filter((p) => p.inStock);
  const lowestPrice = Math.min(...availablePrices.map((p) => p.price));
  const highestPrice = Math.max(...availablePrices.map((p) => p.price));
  const savings = highestPrice - lowestPrice;
  const savingsPercent = ((savings / highestPrice) * 100).toFixed(0);

  const addToCart = async (price: Price) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      platform: price.platform,
      price: price.price,
      quantity: 1,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Added to cart!",
        description: `${product.name} added to your cart`,
      });
    }
  };

  const createPriceAlert = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!targetPrice || !selectedPlatform) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const currentPrice = product.prices.find(p => p.platform === selectedPlatform)?.price || 0;

    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      target_price: parseFloat(targetPrice),
      current_price: currentPrice,
      platform: selectedPlatform,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Alert created!",
        description: "You'll be notified when the price drops",
      });
      setAlertDialogOpen(false);
      setTargetPrice("");
      setSelectedPlatform("");
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {savings > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-success px-2 py-1 text-xs font-semibold text-success-foreground">
              <TrendingDown className="h-3 w-3" />
              Save {savingsPercent}%
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">
              {product.category}
            </Badge>
            <h3 className="font-semibold leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="space-y-2">
            {availablePrices
              .sort((a, b) => a.price - b.price)
              .map((price) => (
                <div
                  key={price.platform}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${platformColors[price.platform] || ""}`}
                    >
                      {price.platform}
                    </Badge>
                    {price.price === lowestPrice && (
                      <span className="text-xs font-semibold text-success">
                        Best Price
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${price.price === lowestPrice ? "text-success text-lg" : "text-foreground"}`}
                    >
                      ₹{price.price.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => addToCart(price)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant={price.price === lowestPrice ? "default" : "outline"}
                      className="h-8 px-3"
                      asChild
                    >
                      <a
                        href={price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-2">
                <Bell className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Price Alert</DialogTitle>
                <DialogDescription>
                  Get notified when the price drops below your target
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Platform</Label>
                  <select
                    className="w-full mt-1 rounded-md border bg-background px-3 py-2"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  >
                    <option value="">Choose platform...</option>
                    {availablePrices.map((price) => (
                      <option key={price.platform} value={price.platform}>
                        {price.platform} - ₹{price.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="target-price">Target Price (₹)</Label>
                  <Input
                    id="target-price"
                    type="number"
                    placeholder="Enter target price"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                  />
                </div>
                <Button onClick={createPriceAlert} className="w-full">
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {savings > 0 && (
            <p className="text-sm text-muted-foreground text-center pt-2 border-t">
              Save up to ₹{savings.toLocaleString()} by choosing the best deal
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
