import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const { data: cartItems, isLoading } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const utils = trpc.useUtils();
  
  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update quantity");
    },
  });
  
  const removeItem = trpc.cart.remove.useMutation({
    onSuccess: () => {
      toast.success("Item removed from cart");
      utils.cart.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove item");
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
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-20" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign In to View Cart</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to see your shopping cart
          </p>
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

  const itemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

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
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="default" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-secondary h-32 animate-pulse" />
              ))}
            </div>
          ) : cartItems && cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  
                  return (
                    <div key={item.id} className="bg-card border border-border p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <Link href={`/products/${product.id}`}>
                          <a className="flex-shrink-0 w-24 h-24 bg-muted flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-20" />
                            )}
                          </a>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${product.id}`}>
                            <a className="font-bold text-card-foreground hover:text-accent transition-colors block mb-1">
                              {product.name}
                            </a>
                          </Link>
                          {item.store && (
                            <p className="text-sm text-muted-foreground mb-2">
                              Sold by {item.store.name}
                            </p>
                          )}
                          <p className="text-lg font-bold text-card-foreground">
                            ${(product.price / 100).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem.mutate({ id: item.id })}
                            disabled={removeItem.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          
                          <div className="flex items-center border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity.mutate({ 
                                id: item.id, 
                                quantity: item.quantity - 1 
                              })}
                              disabled={item.quantity <= 1 || updateQuantity.isPending}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 font-medium text-card-foreground min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity.mutate({ 
                                id: item.id, 
                                quantity: item.quantity + 1 
                              })}
                              disabled={updateQuantity.isPending || item.quantity >= (product.stock || 0)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border p-6 sticky top-4">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-card-foreground">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-medium">${(total / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-card-foreground">
                      <span>Shipping</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-xl font-bold text-card-foreground">
                        <span>Total</span>
                        <span>${(total / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full text-base"
                    onClick={() => setLocation('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Link href="/products">
                    <Button variant="ghost" className="w-full mt-4">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-20" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h3>
              <p className="text-muted-foreground mb-8">
                Add some products to get started!
              </p>
              <Link href="/products">
                <Button size="lg">Browse Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
