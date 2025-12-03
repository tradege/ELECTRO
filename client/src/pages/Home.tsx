import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Gamepad2,
  Utensils,
  ShoppingCart,
  Package,
  Sparkles,
  Clock,
  Star,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DemoGame from "@/components/DemoGame";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: stores } = trpc.stores.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="text-2xl font-bold text-blue-600">
                Electro
              </a>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/stores">
                <a className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  חנויות
                </a>
              </Link>
              <Link href="/categories">
                <a className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  קטגוריות
                </a>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      ההזמנות שלי
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    התחבר
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              מה תרצה להזמין?
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              חנויות ומוצרים במחירים מדהימים - או שחק לזכות!
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                placeholder="הזן כתובת למשלוח..."
                className="border-0 flex-1 text-gray-900"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {categories?.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[120px] text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </Card>
              </Link>
            ))}
            
            {/* Default categories if none exist */}
            {(!categories || categories.length === 0) && (
              <>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[120px] text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <div className="text-sm font-medium text-gray-900">אלקטרוניקה</div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[120px] text-center">
                  <div className="text-3xl mb-2">🎮</div>
                  <div className="text-sm font-medium text-gray-900">גיימינג</div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[120px] text-center">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="text-sm font-medium text-gray-900">בית וגן</div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[120px] text-center">
                  <div className="text-3xl mb-2">👕</div>
                  <div className="text-sm font-medium text-gray-900">אופנה</div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer min-w-[120px] text-center">
                  <div className="text-3xl mb-2">⚽</div>
                  <div className="text-sm font-medium text-gray-900">ספורט</div>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Game Feature Banner */}
      <section className="py-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-wide">חדש!</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                שחק עץ או פלי וזכה במוצר
              </h2>
              <p className="text-green-100 text-lg">
                שלם רק 10% מהמחיר, זכה 5 פעמים והמוצר שלך!
              </p>
            </div>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold">
              נסה עכשיו
              <ChevronRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              חנויות פופולריות
            </h2>
            <Link href="/stores">
              <a className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                ראה הכל
                <ChevronRight className="h-4 w-4" />
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores?.slice(0, 6).map((store) => (
              <Link key={store.id} href={`/stores/${store.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {/* Store Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                    {store.coverImage ? (
                      <img 
                        src={store.coverImage} 
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-16 w-16 text-blue-300" />
                      </div>
                    )}
                    
                    {/* Delivery Time Badge */}
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-600" />
                      <span className="text-xs font-medium text-gray-900">25-35 דק'</span>
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {store.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                      {store.description || "מוצרים איכותיים במחירים מעולים"}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900">4.8</span>
                        <span className="text-gray-500">(200+)</span>
                      </div>
                      <div className="text-gray-600">
                        משלוח ₪15
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {/* Placeholder stores if none exist */}
            {(!stores || stores.length === 0) && (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-blue-300" />
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">25-35 דק'</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        חנות דוגמה {i}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        מוצרים איכותיים במחירים מעולים
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium text-gray-900">4.8</span>
                          <span className="text-gray-500">(200+)</span>
                        </div>
                        <div className="text-gray-600">
                          משלוח ₪15
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Demo Game Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              נסה את המשחק שלנו
            </h2>
            <p className="text-xl text-gray-600">
              בחר עץ או פלי - זכה 5 פעמים וקבל את המוצר!
            </p>
          </div>
          
          <DemoGame />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Electro</h3>
              <p className="text-gray-400">
                המקום לזכות במוצרים במחיר מדהים
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">קישורים</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/stores"><a className="hover:text-white">חנויות</a></Link></li>
                <li><Link href="/categories"><a className="hover:text-white">קטגוריות</a></Link></li>
                <li><Link href="/products"><a className="hover:text-white">מוצרים</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">עזרה</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">שאלות נפוצות</a></li>
                <li><a href="#" className="hover:text-white">צור קשר</a></li>
                <li><a href="#" className="hover:text-white">תנאי שימוש</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">עקוב אחרינו</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Electro. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
