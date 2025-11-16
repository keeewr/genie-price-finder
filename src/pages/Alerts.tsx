import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceAlert {
  id: string;
  product_name: string;
  product_image: string;
  target_price: number;
  current_price: number;
  platform: string;
  is_active: boolean;
  notified: boolean;
}

const Alerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load price alerts",
        variant: "destructive",
      });
    } else {
      setAlerts(data || []);
    }
    setLoading(false);
  };

  const removeAlert = async (id: string) => {
    const { error } = await supabase.from("price_alerts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove alert",
        variant: "destructive",
      });
    } else {
      setAlerts(alerts.filter((alert) => alert.id !== id));
      toast({ title: "Price alert removed" });
    }
  };

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
        <h1 className="text-3xl font-bold mb-6">Price Alerts</h1>

        {alerts.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No price alerts yet</h2>
            <p className="text-muted-foreground mb-4">
              Set alerts on products to get notified when prices drop!
            </p>
            <Button onClick={() => navigate("/")}>Browse Products</Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {alerts.map((alert) => {
              const priceDropped = alert.current_price <= alert.target_price;
              
              return (
                <Card key={alert.id} className={priceDropped ? "border-success" : ""}>
                  <CardContent className="p-4 flex gap-4">
                    <img
                      src={alert.product_image}
                      alt={alert.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2 text-sm">{alert.product_name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1 capitalize">
                        {alert.platform}
                      </Badge>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-semibold">₹{alert.target_price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current:</span>
                          <span className={`font-semibold ${priceDropped ? "text-success" : ""}`}>
                            ₹{alert.current_price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {priceDropped && (
                        <div className="mt-2 flex items-center gap-1 text-sm text-success">
                          <TrendingDown className="h-4 w-4" />
                          <span className="font-semibold">Price target reached!</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAlert(alert.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Alerts;
