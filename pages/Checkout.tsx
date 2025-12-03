import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  const { data: cartItems, isLoading } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const utils = trpc.useUtils();
  
  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      utils.cart.get.invalidate();
      setLocation(`/orders/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create order");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-background">
          <div className="container mx-auto">
            <div className="flex items-center justify-between h-16">
              <Link href="/">
                <a className="text-2xl font-bold text-foreground">ELECTRO</a>
              </Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign In to Checkout</h1>
          <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const total = cartItems?.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    const orderItems = cartItems.map(item => ({
      productId: item.product!.id,
      storeId: item.product!.storeId,
      quantity: item.quantity,
      priceAtPurchase: item.product!.price,
      productName: item.product!.name,
    }));

    createOrder.mutate({
      items: orderItems,
      totalAmount: total,
      shippingAddress,
      notes: notes || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-background">
          <div className="container mx-auto">
            <div className="flex items-center justify-between h-16">
              <Link href="/">
                <a className="text-2xl font-bold text-foreground">ELECTRO</a>
              </Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto py-20 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-20" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <a className="text-2xl font-bold text-foreground hover:text-accent transition-colors">
                ELECTRO
              </a>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" size="sm">Back to Cart</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Checkout Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground">Shipping Information</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full shipping address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for your order"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="bg-card border border-border p-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const product = item.product;
                      if (!product) return null;
                      
                      return (
                        <div key={item.id} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                          <div className="w-16 h-16 bg-muted flex items-center justify-center flex-shrink-0">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag className="h-6 w-6 text-muted-foreground opacity-20" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-card-foreground truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-card-foreground">
                            ${((product.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border p-6 sticky top-4">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-card-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium">${(total / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-card-foreground">
                      <span>Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-xl font-bold text-card-foreground">
                        <span>Total</span>
                        <span>${(total / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full text-base"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? "Placing Order..." : "Place Order"}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
