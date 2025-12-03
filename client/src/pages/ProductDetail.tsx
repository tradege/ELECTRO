import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Store as StoreIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  
  const productId = Number(id);
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const { data: store } = trpc.stores.getById.useQuery(
    { id: product?.storeId || 0 },
    { enabled: !!product?.storeId }
  );
  
  const utils = trpc.useUtils();
  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
      utils.cart.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    
    if (!product) return;
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    
    addToCart.mutate({
      productId: product.id,
      quantity,
    });
  };

  if (isLoading) {
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
        <div className="container mx-auto py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square bg-secondary"></div>
              <div className="space-y-4">
                <div className="h-12 bg-secondary w-3/4"></div>
                <div className="h-6 bg-secondary w-1/4"></div>
                <div className="h-24 bg-secondary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
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

      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/">
              <a className="hover:text-foreground transition-colors">Home</a>
            </Link>
            <span>/</span>
            <Link href="/products">
              <a className="hover:text-foreground transition-colors">Products</a>
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingBag className="h-32 w-32 text-muted-foreground opacity-20" />
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
                
                {store && (
                  <Link href={`/stores/${store.id}`}>
                    <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-4">
                      <StoreIcon className="h-4 w-4" />
                      {store.name}
                    </a>
                  </Link>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${(product.compareAtPrice / 100).toFixed(2)}
                    </span>
                  )}
                </div>

                {product.stock <= 0 ? (
                  <p className="text-destructive font-medium">Out of Stock</p>
                ) : product.stock < 10 ? (
                  <p className="text-accent font-medium">Only {product.stock} left in stock!</p>
                ) : (
                  <p className="text-muted-foreground">In Stock</p>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground">Quantity:</span>
                  <div className="flex items-center border border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-6 font-medium text-foreground">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full text-base"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addToCart.isPending}
                >
                  {addToCart.isPending ? (
                    "Adding..."
                  ) : product.stock <= 0 ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
