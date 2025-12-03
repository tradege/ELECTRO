import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, TrendingUp, ArrowRight, Gamepad2, Trophy, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery({});
  const { data: stores, isLoading: storesLoading } = trpc.stores.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  const featuredProducts = products?.slice(0, 4) || [];
  const featuredStores = stores?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
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
              <Link href="/categories">
                <a className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                  Categories
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
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[600px] py-20">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight">
                Discover
                <br />
                Your Style
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Shop from multiple stores, find unique products, and get everything delivered to your door.
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="text-base px-8">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/stores">
                  <Button size="lg" variant="outline" className="text-base px-8">
                    Browse Stores
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative h-[500px] bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ShoppingBag className="h-32 w-32 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Hero Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-y-4 border-green-500">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
              <Gamepad2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              🎮 משחק עץ או פלי
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-2">
              שחק במשחק המרגש שלנו וזכה במוצרים במחיר מדהים!
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              משלם רק 10% מהמחיר, מנצח 5 פעמים - והמוצר שלך! 🎁
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">משלם מעט</h3>
                <p className="text-gray-600">
                  רק 10% מהמחיר המלא! חולצה ב-100₪? שחק ב-10₪ בלבד
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Gamepad2 className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">בחר עץ או פלי</h3>
                <p className="text-gray-600">
                  משחק פשוט ומהנה! בחר נכון 5 פעמים וזכה
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">זכה במוצר!</h3>
                <p className="text-gray-600">
                  5 זכיות = קוד לאיסוף המוצר. פשוט וכיף!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-12 py-6">
                <Gamepad2 className="mr-2 h-6 w-6" />
                בחר מוצר והתחל לשחק!
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              💡 כל מוצר באתר זמין למשחק - בחר מה שאתה רוצה!
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground">
                <Store className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Multiple Stores</h3>
              <p className="text-muted-foreground">
                Shop from a variety of stores, all in one place
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Curated Selection</h3>
              <p className="text-muted-foreground">
                Discover unique products from trusted sellers
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Best Deals</h3>
              <p className="text-muted-foreground">
                Get the best prices and exclusive offers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground">Featured Products</h2>
            <Link href="/products">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {productsLoading ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-background h-96 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <a className="group block bg-background hover:shadow-lg transition-shadow">
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
                      <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${(product.compareAtPrice / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Stores */}
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground">Featured Stores</h2>
            <Link href="/stores">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {storesLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-secondary h-64 animate-pulse" />
              ))}
            </div>
          ) : featuredStores.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredStores.map((store) => (
                <Link key={store.id} href={`/stores/${store.id}`}>
                  <a className="group block bg-secondary hover:bg-muted transition-colors p-8 text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-background flex items-center justify-center">
                      {store.logo ? (
                        <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                      ) : (
                        <Store className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {store.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {store.description || 'Discover amazing products from this store'}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No stores available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold">Ready to Start Shopping?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover your next favorite product today.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-base px-12">
              Explore Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">ELECTRO</h3>
              <p className="text-sm text-muted-foreground">
                Your one-stop marketplace for products from multiple stores.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products"><a className="hover:text-foreground transition-colors">All Products</a></Link></li>
                <li><Link href="/stores"><a className="hover:text-foreground transition-colors">All Stores</a></Link></li>
                <li><Link href="/categories"><a className="hover:text-foreground transition-colors">Categories</a></Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard"><a className="hover:text-foreground transition-colors">Dashboard</a></Link></li>
                <li><Link href="/orders"><a className="hover:text-foreground transition-colors">My Orders</a></Link></li>
                <li><Link href="/cart"><a className="hover:text-foreground transition-colors">Shopping Cart</a></Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Electro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
