import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Gamepad2, ShoppingBag, Sparkles, Trophy } from "lucide-react";
import { Link } from "wouter";
import DemoGame from "@/components/DemoGame";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="text-3xl font-black text-gray-900 tracking-tight hover:text-gray-700 transition-colors">
                ELECTRO
              </a>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products">
                <a className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  מוצרים
                </a>
              </Link>
              <Link href="/stores">
                <a className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  חנויות
                </a>
              </Link>
              <Link href="/categories">
                <a className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  קטגוריות
                </a>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      הזמנות שלי
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button size="sm" className="bg-black hover:bg-gray-800">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="sm" className="bg-black hover:bg-gray-800">
                    התחבר
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-electronics.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 leading-none">
              זכה<br />במוצר<br />שלך
            </h1>
            <p className="text-2xl text-white/90 mb-8 font-light">
              שלם רק 10% מהמחיר. שחק במשחק עץ או פלי. זכה 5 פעמים והמוצר שלך.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 h-auto font-bold">
                  התחל לשחק
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 h-auto font-bold">
                קנה עכשיו
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'url(/game-background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-gray-900 mb-6">
              נסה את המשחק
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              משחק פשוט ומהנה. בחר עץ או פלי וראה אם זכית.
            </p>
          </div>

          {/* Game Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
              <div className="text-5xl font-black text-gray-900 mb-2">10%</div>
              <div className="text-sm font-medium text-gray-600">מהמחיר המלא</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
              <div className="text-5xl font-black text-gray-900 mb-2">45%</div>
              <div className="text-sm font-medium text-gray-600">סיכוי לזכות</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
              <div className="text-5xl font-black text-gray-900 mb-2">5</div>
              <div className="text-sm font-medium text-gray-600">זכיות = מוצר</div>
            </div>
          </div>

          {/* Demo Game */}
          <DemoGame />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl font-black text-gray-900">
              מוצרים מובילים
            </h2>
            <Link href="/products">
              <Button variant="ghost" className="text-lg font-medium">
                ראה הכל
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                <img 
                  src="/hero-gaming.jpg" 
                  alt="Gaming Setup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gaming Setup Pro</h3>
              <p className="text-gray-600 mb-4">סטאפ גיימינג מושלם</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-gray-900">₪3,000</div>
                  <div className="text-sm text-gray-500">או ₪300 למשחק</div>
                </div>
                <Button className="bg-black hover:bg-gray-800">
                  שחק לזכות
                </Button>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                <img 
                  src="/hero-electronics.jpg" 
                  alt="Premium Gadgets"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Gadgets</h3>
              <p className="text-gray-600 mb-4">גאדג'טים פרימיום</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-gray-900">₪1,500</div>
                  <div className="text-sm text-gray-500">או ₪150 למשחק</div>
                </div>
                <Button className="bg-black hover:bg-gray-800">
                  שחק לזכות
                </Button>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <Sparkles className="h-24 w-24 text-gray-400" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Watch</h3>
              <p className="text-gray-600 mb-4">שעון חכם מתקדם</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-gray-900">₪800</div>
                  <div className="text-sm text-gray-500">או ₪80 למשחק</div>
                </div>
                <Button className="bg-black hover:bg-gray-800">
                  שחק לזכות
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl font-black text-center mb-20">
            איך זה עובד?
          </h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-black rounded-full mb-6 text-3xl font-black">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">בחר מוצר</h3>
              <p className="text-gray-400 text-lg">
                בחר את המוצר שאתה רוצה מהקטלוג שלנו
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-black rounded-full mb-6 text-3xl font-black">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">שלם ושחק</h3>
              <p className="text-gray-400 text-lg">
                שלם 10% מהמחיר ושחק במשחק עץ או פלי
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-black rounded-full mb-6 text-3xl font-black">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">זכה במוצר</h3>
              <p className="text-gray-400 text-lg">
                זכה 5 פעמים וקבל קוד לאיסוף המוצר
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/products">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-xl px-12 py-8 h-auto font-black">
                התחל עכשיו
                <ArrowLeft className="mr-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-4">ELECTRO</h3>
              <p className="text-gray-400">
                המקום לזכות במוצרים במחיר מדהים
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">קישורים</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products"><a className="hover:text-white transition-colors">מוצרים</a></Link></li>
                <li><Link href="/stores"><a className="hover:text-white transition-colors">חנויות</a></Link></li>
                <li><Link href="/categories"><a className="hover:text-white transition-colors">קטגוריות</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">עזרה</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">שאלות נפוצות</a></li>
                <li><a href="#" className="hover:text-white transition-colors">צור קשר</a></li>
                <li><a href="#" className="hover:text-white transition-colors">תנאי שימוש</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">עקוב אחרינו</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2024 ELECTRO. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
