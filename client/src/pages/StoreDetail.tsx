import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  Clock,
  Star,
  Info,
  ShoppingCart,
  Plus,
  Gamepad2
} from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function StoreDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  
  const { data: store } = trpc.stores.getById.useQuery({ id: Number(id) });
  const { data: products } = trpc.products.getByStore.useQuery({ storeId: Number(id) });
  const addToCart = trpc.cart.add.useMutation();

  const handleAddToCart = (productId: number) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    
    addToCart.mutate({ productId, quantity: 1 });
    setSelectedProduct(productId);
    setTimeout(() => setSelectedProduct(null), 1000);
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <div className="text-xl text-gray-600">טוען...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
            </div>
            <Link href="/cart">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Store Cover */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
        {store.coverImage ? (
          <img 
            src={store.coverImage} 
            alt={store.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="h-24 w-24 text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Store Info */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h2>
              <p className="text-gray-600 mb-4">{store.description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">4.8</span>
                  <span className="text-gray-500">(200+ דירוגים)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>25-35 דק'</span>
                </div>
                <div className="text-gray-600">
                  משלוח ₪15
                </div>
              </div>
            </div>

            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              פתוח
            </Badge>
          </div>

          {/* Game Banner in Store */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-6 w-6" />
                <div>
                  <div className="font-bold text-lg">שחק לזכות במוצרים מהחנות</div>
                  <div className="text-sm text-green-100">שלם 10% בלבד וזכה!</div>
                </div>
              </div>
              <Button size="sm" className="bg-white text-green-600 hover:bg-gray-100 font-bold">
                למד עוד
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Products Menu */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">תפריט</h3>

        <div className="space-y-4">
          {products?.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex gap-4 p-4">
                {/* Product Image */}
                <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        ₪{(product.price / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        או ₪{(product.price / 100 * 0.1).toFixed(2)} למשחק
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => {/* Navigate to game */}}
                      >
                        <Gamepad2 className="h-4 w-4 ml-1" />
                        שחק
                      </Button>
                      <Button
                        size="sm"
                        className={`bg-blue-600 hover:bg-blue-700 ${selectedProduct === product.id ? 'bg-green-600' : ''}`}
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addToCart.isPending}
                      >
                        <Plus className="h-4 w-4 ml-1" />
                        {selectedProduct === product.id ? 'נוסף!' : 'הוסף'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Placeholder products if none exist */}
          {(!products || products.length === 0) && (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-1">מוצר דוגמה {i}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        תיאור מוצר מעניין ומפורט
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-900">₪{(50 + i * 10).toFixed(2)}</div>
                          <div className="text-sm text-green-600 font-medium">
                            או ₪{((50 + i * 10) * 0.1).toFixed(2)} למשחק
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-green-500 text-green-600">
                            <Gamepad2 className="h-4 w-4 ml-1" />
                            שחק
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 ml-1" />
                            הוסף
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Store Info Footer */}
      <div className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-2 text-gray-600">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">מידע על החנות</p>
              <p>זמני פתיחה: ראשון-חמישי 09:00-22:00, שישי 09:00-15:00</p>
              <p>משלוח מינימלי: ₪50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
