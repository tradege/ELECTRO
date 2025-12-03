import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Store as StoreIcon, Gamepad2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { GamePurchaseModal } from "@/components/GamePurchaseModal";
import { TreeOrLeafGame } from "@/components/TreeOrLeafGame";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [prizeCode, setPrizeCode] = useState<string | null>(null);
  
  const productId = Number(id);
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const { data: store } = trpc.stores.getById.useQuery(
    { id: product?.storeId || 0 },
    { enabled: !!product?.storeId }
  );
  
  const { data: activeSession, refetch: refetchSession } = trpc.game.getActiveSession.useQuery(
    { productId },
    { enabled: isAuthenticated && !!productId }
  );
  
  const handleGamePurchaseSuccess = () => {
    refetchSession();
    setShowGame(true);
  };
  
  const handleGameWin = (code: string) => {
    setPrizeCode(code);
    toast.success(`🎉 מזל טוב! קוד הפרס שלך: ${code}`);
  };
  
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
                
                {/* Game Option */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">או</span>
                  </div>
                </div>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-base border-2 border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800"
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = getLoginUrl();
                      return;
                    }
                    if (activeSession) {
                      setShowGame(true);
                    } else {
                      setShowGameModal(true);
                    }
                  }}
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  {activeSession ? 'המשך משחק' : 'שחק לזכות'} - ₪{Math.floor(product.price * 0.1)}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  💡 שחק במשחק "עץ או פלי" וזכה במוצר ב-10% מהמחיר!
                </p>
              </div>
            </div>
          </div>
          
          {/* Game Section */}
          {isAuthenticated && activeSession && showGame && (
            <div className="mt-12">
              <TreeOrLeafGame
                productId={productId}
                productName={product.name}
                productPrice={product.price}
                onWin={handleGameWin}
              />
            </div>
          )}
          
          {/* Prize Code Display */}
          {prizeCode && (
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-yellow-900 mb-2">🎉 מזל טוב! זכית!</h3>
              <p className="text-yellow-800 mb-4">קוד הפרס שלך:</p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <code className="text-3xl font-mono font-bold text-yellow-900">{prizeCode}</code>
              </div>
              <p className="text-sm text-yellow-800 mt-4">
                שמור את הקוד הזה ופנה לאיסוף המוצר
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Game Purchase Modal */}
      <GamePurchaseModal
        open={showGameModal}
        onOpenChange={setShowGameModal}
        productId={productId}
        productName={product.name}
        productPrice={product.price}
        onSuccess={handleGamePurchaseSuccess}
      />
    </div>
  );
}
