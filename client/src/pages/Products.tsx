import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [storeFilter, setStoreFilter] = useState<number | undefined>();

  const { data: products, isLoading } = trpc.products.list.useQuery({
    categoryId: categoryFilter,
    storeId: storeFilter,
  });
  
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: stores } = trpc.stores.list.useQuery();

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
                <a className="text-sm font-medium text-accent">Products</a>
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

      {/* Header */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-4">All Products</h1>
          <p className="text-xl text-muted-foreground">
            Discover amazing products from our marketplace
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto py-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4" />
              Filters:
            </div>
            
            <Select
              value={categoryFilter?.toString() || "all"}
              onValueChange={(value) => setCategoryFilter(value === "all" ? undefined : Number(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={storeFilter?.toString() || "all"}
              onValueChange={(value) => setStoreFilter(value === "all" ? undefined : Number(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores?.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(categoryFilter || storeFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter(undefined);
                  setStoreFilter(undefined);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
              <h3 className="text-2xl font-bold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                {categoryFilter || storeFilter
                  ? "Try adjusting your filters"
                  : "Check back soon for new products"}
              </p>
              {(categoryFilter || storeFilter) && (
                <Button
                  onClick={() => {
                    setCategoryFilter(undefined);
                    setStoreFilter(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
