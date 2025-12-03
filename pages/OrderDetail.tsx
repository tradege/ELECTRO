import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const orderId = Number(id);
  
  const { data: orderData, isLoading } = trpc.orders.getById.useQuery(
    { id: orderId },
    { enabled: isAuthenticated && !!orderId }
  );

  if (authLoading || isLoading) {
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign In to View Order</h1>
          <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!orderData) {
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Order Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { items, ...order } = orderData;

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
              <Link href="/dashboard">
                <Button variant="default" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/">
              <a className="hover:text-foreground transition-colors">Home</a>
            </Link>
            <span>/</span>
            <Link href="/dashboard">
              <a className="hover:text-foreground transition-colors">Dashboard</a>
            </Link>
            <span>/</span>
            <span className="text-foreground">Order #{order.id}</span>
          </div>
        </div>
      </div>

      {/* Order Detail */}
      <section className="py-12 bg-background">
        <div className="container mx-auto max-w-4xl">
          {/* Order Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Order #{order.id}</h1>
                <p className="text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span className={`text-sm px-4 py-2 font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card border border-border p-6 mb-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">Order Items</h2>
            <div className="space-y-4">
              {items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-border last:border-0">
                  <div className="w-20 h-20 bg-muted flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-card-foreground mb-1">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(item.priceAtPurchase / 100).toFixed(2)} each
                    </p>
                  </div>
                  <p className="font-bold text-card-foreground">
                    ${((item.priceAtPurchase * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between text-xl font-bold text-card-foreground">
                <span>Total</span>
                <span>${(order.totalAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {order.shippingAddress && (
            <div className="bg-card border border-border p-6 mb-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Shipping Address</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-card border border-border p-6 mb-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Order Notes</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {order.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
