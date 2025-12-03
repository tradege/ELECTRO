import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trophy, Leaf, TreePine } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface TreeOrLeafGameProps {
  productId: number;
  productName: string;
  productPrice: number;
  onWin?: (prizeCode: string) => void;
}

export function TreeOrLeafGame({ productId, productName, productPrice, onWin }: TreeOrLeafGameProps) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastResult, setLastResult] = useState<{ choice: 'tree' | 'leaf'; result: 'tree' | 'leaf'; isWin: boolean } | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Get active session
  const { data: activeSession, refetch: refetchSession } = trpc.game.getActiveSession.useQuery(
    { productId },
    { enabled: !!productId }
  );

  // Play mutation
  const playMutation = trpc.game.play.useMutation({
    onSuccess: (data) => {
      setLastResult({ choice: data.choice, result: data.result, isWin: data.isWin });
      setShowResult(true);
      setIsPlaying(false);

      // Show result toast
      if (data.isWin) {
        toast.success('🎉 זכית!');
      } else {
        toast.error('😔 לא הפעם...');
      }

      // Check if won the product
      if (data.session && data.session.status === 'won' && data.session.prizeCode) {
        setTimeout(() => {
          onWin?.(data.session!.prizeCode!);
        }, 2000);
      }

      // Refetch session after a delay
      setTimeout(() => {
        refetchSession();
        setShowResult(false);
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsPlaying(false);
    },
  });

  useEffect(() => {
    if (activeSession) {
      setSessionId(activeSession.id);
    }
  }, [activeSession]);

  const handlePlay = (choice: 'tree' | 'leaf') => {
    if (!sessionId || isPlaying) return;
    setIsPlaying(true);
    playMutation.mutate({ sessionId, choice });
  };

  if (!activeSession) {
    return null;
  }

  const gamePrice = Math.floor(productPrice * 0.1);
  const winsNeeded = 5;
  const currentWins = activeSession.wins;
  const attemptsLeft = activeSession.totalAttempts - activeSession.attemptsUsed;
  const progressPercent = (currentWins / winsNeeded) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎮 עץ או פלי</h3>
          <p className="text-gray-600">בחר נכון 5 פעמים וזכה ב-{productName}!</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>זכיות: {currentWins}/{winsNeeded}</span>
            <span>ניסיונות נותרו: {attemptsLeft}</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Game Area */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {showResult && lastResult ? (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5 }}
                  className={`text-8xl mb-4 ${lastResult.isWin ? 'text-green-500' : 'text-red-500'}`}
                >
                  {lastResult.result === 'tree' ? '🌳' : '🍃'}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-2xl font-bold ${lastResult.isWin ? 'text-green-600' : 'text-red-600'}`}
                >
                  {lastResult.isWin ? 'זכית! 🎉' : 'לא הפעם 😔'}
                </motion.p>
                <p className="text-gray-600 mt-2">
                  בחרת: {lastResult.choice === 'tree' ? 'עץ' : 'פלי'} | יצא: {lastResult.result === 'tree' ? 'עץ' : 'פלי'}
                </p>
              </motion.div>
            ) : isPlaying ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <Loader2 className="w-16 h-16 animate-spin text-green-600" />
                <p className="mt-4 text-gray-600">מגריל...</p>
              </motion.div>
            ) : (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-8"
              >
                {/* Tree Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => handlePlay('tree')}
                    disabled={isPlaying || attemptsLeft === 0}
                    className="h-32 w-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <div className="flex flex-col items-center">
                      <TreePine className="w-12 h-12 mb-2" />
                      <span className="text-lg font-bold">עץ</span>
                    </div>
                  </Button>
                </motion.div>

                {/* Leaf Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => handlePlay('leaf')}
                    disabled={isPlaying || attemptsLeft === 0}
                    className="h-32 w-32 rounded-full bg-gradient-to-br from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white shadow-lg"
                  >
                    <div className="flex flex-col items-center">
                      <Leaf className="w-12 h-12 mb-2" />
                      <span className="text-lg font-bold">פלי</span>
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status */}
        {activeSession.status === 'won' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 text-center"
          >
            <Trophy className="w-12 h-12 mx-auto text-yellow-600 mb-2" />
            <p className="text-xl font-bold text-yellow-900">מזל טוב! זכית במוצר!</p>
            <p className="text-sm text-yellow-800 mt-1">קוד הפרס שלך: <span className="font-mono font-bold">{activeSession.prizeCode}</span></p>
          </motion.div>
        )}

        {activeSession.status === 'lost' && (
          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-red-900">המשחק הסתיים</p>
            <p className="text-sm text-red-800 mt-1">נגמרו הניסיונות. תוכל לנסות שוב!</p>
          </div>
        )}

        {attemptsLeft === 0 && activeSession.status === 'active' && (
          <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-orange-900">נגמרו הניסיונות</p>
            <p className="text-sm text-orange-800 mt-1">רכוש עוד ניסיונות כדי להמשיך לשחק</p>
          </div>
        )}
      </div>
    </Card>
  );
}
