import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface GamePurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName: string;
  productPrice: number;
  onSuccess?: () => void;
}

export function GamePurchaseModal({
  open,
  onOpenChange,
  productId,
  productName,
  productPrice,
  onSuccess,
}: GamePurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<'single' | 'triple'>('single');
  const [isProcessing, setIsProcessing] = useState(false);

  const startSessionMutation = trpc.game.startSession.useMutation({
    onSuccess: (data) => {
      if (data.existing) {
        toast.info('יש לך כבר משחק פעיל למוצר זה');
      } else {
        toast.success('המשחק התחיל! בהצלחה! 🎮');
      }
      setIsProcessing(false);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
      setIsProcessing(false);
    },
  });

  const gamePrice = Math.floor(productPrice * 0.1);
  const singlePrice = gamePrice;
  const triplePrice = gamePrice * 3;

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // In a real app, this would integrate with a payment gateway
    // For now, we'll simulate payment success
    setTimeout(() => {
      startSessionMutation.mutate({
        productId,
        packageType: selectedPackage,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎮 שחק לזכות ב-{productName}</DialogTitle>
          <DialogDescription>
            בחר נכון 5 פעמים במשחק "עץ או פלי" וזכה במוצר!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Package: Single Attempt */}
          <Card
            className={`p-4 cursor-pointer transition-all ${
              selectedPackage === 'single'
                ? 'border-2 border-green-500 bg-green-50'
                : 'border-2 border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPackage('single')}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold">ניסיון בודד</h3>
                  {selectedPackage === 'single' && (
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  ניסיון אחד במשחק
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">₪{singlePrice}</span>
                  <span className="text-sm text-gray-500">במקום ₪{productPrice}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Package: Triple Attempts */}
          <Card
            className={`p-4 cursor-pointer transition-all relative overflow-hidden ${
              selectedPackage === 'triple'
                ? 'border-2 border-orange-500 bg-orange-50'
                : 'border-2 border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPackage('triple')}
          >
            {/* Best Value Badge */}
            <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
              <Zap className="w-3 h-3 inline mr-1" />
              הכי משתלם!
            </div>

            <div className="flex items-start justify-between mt-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold">חבילת 4 ניסיונות</h3>
                  {selectedPackage === 'triple' && (
                    <div className="bg-orange-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  4 ניסיונות במחיר של 3 - בונוס ניסיון חינם!
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">₪{triplePrice}</span>
                  <span className="text-sm text-gray-500 line-through">₪{singlePrice * 4}</span>
                  <span className="text-sm font-bold text-orange-600">חסכון של ₪{singlePrice}!</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Game Rules */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">📋 חוקי המשחק:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• בחר "עץ" או "פלי" בכל סיבוב</li>
              <li>• אם הבחירה שלך נכונה - זכית בסיבוב!</li>
              <li>• צריך לזכות 5 פעמים כדי לקבל את המוצר</li>
              <li>• אחוזי הזכייה: 45% למשתמש</li>
              <li>• אם זכית - תקבל קוד לאיסוף המוצר</li>
            </ul>
          </Card>

          {/* Purchase Button */}
          <Button
            size="lg"
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
          >
            {isProcessing ? (
              <>מעבד תשלום...</>
            ) : (
              <>
                שלם ₪{selectedPackage === 'single' ? singlePrice : triplePrice} והתחל לשחק
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            התשלום מאובטח ומוצפן. לא נשמור את פרטי כרטיס האשראי שלך.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
