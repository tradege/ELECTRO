import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store as StoreIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const storeId = Number(id);
  
  const { data: store, isLoading: storeLoading } = trpc.stores.getById.useQuery({ id: storeId });
  const { data: products, isLoading: productsLoading } = trpc.products.getByStore.useQuery(
    { storeId },
    { enabled: !!storeId }
  );

  if (storeLoading) {
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
            <div className="h-48 bg-secondary"></div>
            <div className="h-8 bg-secondary w-1/3"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-secondary"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Store Not Found</h1>
          <Link href="/stores">
            <Button>Back to Stores</Button>
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
            <Link href="/stores">
              <a className="hover:text-foreground transition-colors">Stores</a>
            </Link>
            <span>/</span>
            <span className="text-foreground">{store.name}</span>
          </div>
        </div>
      </div>

      {/* Store Header */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-background flex items-center justify-center flex-shrink-0">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-contain p-4" />
              ) : (
                <StoreIcon className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-foreground mb-4">{store.name}</h1>
              <p className="text-xl text-muted-foreground">
                {store.description || 'Discover amazing products from this store'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Products */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Products from {store.name}</h2>
          
          {productsLoading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-secondary h-96 animate-pulse" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <a className="group block bg-card border border-border hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-20" />
                      )}
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-bold text-card-foreground group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-card-foreground">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${(product.compareAtPrice / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.stock <= 0 && (
                        <p className="text-sm text-destructive font-medium">Out of Stock</p>
                      )}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-20" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">
                This store hasn't added any products yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
