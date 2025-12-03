import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, User, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { data: orders, isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (loading) {
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
          <User className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-20" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Sign In to View Dashboard</h1>
          <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const recentOrders = orders?.slice(0, 5) || [];

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
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products">
                <a className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                  Products
                </a>
              </Link>
              <Link href="/stores">
                <a className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                  Stores
                </a>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="default" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {user?.name || user?.email || 'User'}!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {orders?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <Link href="/cart">
              <a className="block bg-card border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent text-accent-foreground flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shopping Cart</p>
                    <p className="text-2xl font-bold text-card-foreground">View Cart</p>
                  </div>
                </div>
              </a>
            </Link>

            <div className="bg-card border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary text-secondary-foreground flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="text-lg font-bold text-card-foreground truncate">
                    {user?.email || 'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-card-foreground">Recent Orders</h2>
              {orders && orders.length > 5 && (
                <Link href="/orders">
                  <Button variant="ghost">View All</Button>
                </Link>
              )}
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-secondary animate-pulse" />
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <a className="block border border-border p-4 hover:bg-secondary transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-card-foreground mb-1">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-card-foreground mb-1">
                            ${(order.totalAmount / 100).toFixed(2)}
                          </p>
                          <span className={`text-sm px-3 py-1 inline-block ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                <Link href="/products">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Admin Panel Link */}
          {user?.role === 'admin' && (
            <div className="mt-8 bg-primary text-primary-foreground p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Admin Access</h3>
              <p className="mb-4 opacity-90">Manage stores, products, and orders</p>
              <Link href="/admin">
                <Button variant="secondary" size="lg">
                  Go to Admin Panel
                </Button>
              </Link>
            </div>
          )}

          {/* Logout */}
          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
