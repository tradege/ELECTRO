import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store as StoreIcon, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Stores() {
  const { data: stores, isLoading } = trpc.stores.list.useQuery();

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
                <a className="text-sm font-medium text-accent">Stores</a>
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
          <h1 className="text-5xl font-bold text-foreground mb-4">Our Stores</h1>
          <p className="text-xl text-muted-foreground">
            Discover unique products from our curated collection of stores
          </p>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-secondary h-64 animate-pulse" />
              ))}
            </div>
          ) : stores && stores.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {stores.map((store) => (
                <Link key={store.id} href={`/stores/${store.id}`}>
                  <a className="group block bg-card border border-border hover:shadow-lg transition-all p-8 text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-secondary flex items-center justify-center">
                      {store.logo ? (
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <StoreIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground group-hover:text-accent transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {store.description || 'Discover amazing products from this store'}
                    </p>
                    <div className="pt-4">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                        View Store
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <StoreIcon className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-20" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Stores Available</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for new stores
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
