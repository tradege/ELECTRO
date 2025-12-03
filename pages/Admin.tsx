import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store as StoreIcon, Package, ShoppingBag, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("stores");

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

  if (!isAuthenticated || user?.role !== 'admin') {
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You don't have permission to access this page</p>
          <Link href="/">
            <Button>Go Home</Button>
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
                ELECTRO ADMIN
              </a>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">User Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">View Site</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Admin Panel</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="stores">
              <StoresTab />
            </TabsContent>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function StoresTab() {
  const { data: stores, isLoading } = trpc.stores.list.useQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  const utils = trpc.useUtils();
  const createStore = trpc.stores.create.useMutation({
    onSuccess: () => {
      toast.success("Store created successfully!");
      utils.stores.list.invalidate();
      setIsDialogOpen(false);
      setStoreName("");
      setStoreDescription("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create store");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStore.mutate({
      name: storeName,
      description: storeDescription,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Manage Stores</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name *</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  placeholder="Enter store name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">Description</Label>
                <Textarea
                  id="store-description"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Enter store description"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createStore.isPending}>
                {createStore.isPending ? "Creating..." : "Create Store"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-secondary h-32 animate-pulse" />
          ))}
        </div>
      ) : stores && stores.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div key={store.id} className="bg-card border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                  <StoreIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-card-foreground mb-1">{store.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {store.description || 'No description'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border">
          <StoreIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">No stores yet. Create your first store!</p>
        </div>
      )}
    </div>
  );
}

function ProductsTab() {
  const { data: products, isLoading } = trpc.products.list.useQuery({});
  const { data: stores } = trpc.stores.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const utils = trpc.useUtils();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      utils.products.list.invalidate();
      setIsDialogOpen(false);
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductStock("");
      setSelectedStore("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStore) {
      toast.error("Please select a store");
      return;
    }

    createProduct.mutate({
      storeId: Number(selectedStore),
      name: productName,
      description: productDescription,
      price: Math.round(parseFloat(productPrice) * 100),
      stock: parseInt(productStock) || 0,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Manage Products</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-store">Store *</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores?.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price ($) *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock *</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    required
                    placeholder="0"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createProduct.isPending}>
                {createProduct.isPending ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-secondary h-64 animate-pulse" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card border border-border">
              <div className="aspect-square bg-muted flex items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground opacity-20" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-card-foreground">{product.name}</h3>
                <p className="text-lg font-bold text-accent">
                  ${(product.price / 100).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">No products yet. Create your first product!</p>
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const { data: orders, isLoading } = trpc.orders.listAll.useQuery();

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">All Orders</h2>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-secondary h-20 animate-pulse" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <a className="block bg-card border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-card-foreground mb-1">Order #{order.id}</p>
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
        <div className="text-center py-12 bg-card border border-border">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      )}
    </div>
  );
}
