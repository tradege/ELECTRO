import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

type Choice = "tree" | "leaf";

interface GameResult {
  playerChoice: Choice;
  drawnResult: Choice;
  isWin: boolean;
}

export default function DemoGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [demoWins, setDemoWins] = useState(0);
  const [demoLosses, setDemoLosses] = useState(0);

  const handlePlay = async (selectedChoice: Choice) => {
    if (isPlaying) return;

    setIsPlaying(true);
    setGameResult(null);

    // Simulate game delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo mode: 45% win rate (matching the real game)
    const winChance = Math.random() < 0.45;
    const drawnResult: Choice = winChance ? selectedChoice : (selectedChoice === "tree" ? "leaf" : "tree");

    const result: GameResult = {
      playerChoice: selectedChoice,
      drawnResult,
      isWin: winChance,
    };

    setGameResult(result);

    if (winChance) {
      setDemoWins((prev) => prev + 1);
    } else {
      setDemoLosses((prev) => prev + 1);
    }

    // Reset after showing result
    setTimeout(() => {
      setIsPlaying(false);
      setGameResult(null);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-4xl font-bold text-gray-900 mb-3">
          נסה את המשחק
        </h3>
        <p className="text-lg text-gray-600">
          בחר עץ או פלי וראה אם זכית
        </p>
        
        {/* Stats */}
        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            <span className="font-bold text-green-600 text-lg">
              זכיות: {demoWins}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-600 text-lg">
              הפסדים: {demoLosses}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            ({demoWins + demoLosses > 0 ? Math.round((demoWins / (demoWins + demoLosses)) * 100) : 0}% זכייה)
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center mb-8 overflow-hidden border-2 border-gray-200">
        <AnimatePresence mode="wait">
          {!isPlaying && !gameResult && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <div className="text-7xl mb-4">🎲</div>
              <p className="text-2xl font-bold text-gray-700">
                בחר עץ או פלי
              </p>
              <p className="text-sm text-gray-500 mt-2">
                45% סיכוי לזכות
              </p>
            </motion.div>
          )}

          {isPlaying && !gameResult && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-8xl mb-4"
              >
                🎲
              </motion.div>
              <p className="text-2xl font-bold text-gray-700">
                מגריל...
              </p>
            </motion.div>
          )}

          {gameResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center w-full px-8"
            >
              {/* Result Display */}
              <div className="mb-6">
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-9xl mb-4"
                >
                  {gameResult.drawnResult === "tree" ? "🌳" : "🍃"}
                </motion.div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  יצא: {gameResult.drawnResult === "tree" ? "עץ" : "פלי"}
                </p>
              </div>

              {/* Win/Loss Message */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`p-6 rounded-lg ${
                  gameResult.isWin 
                    ? "bg-green-100 border-2 border-green-500" 
                    : "bg-red-100 border-2 border-red-500"
                }`}
              >
                <p className={`text-3xl font-bold mb-2 ${
                  gameResult.isWin ? "text-green-700" : "text-red-700"
                }`}>
                  {gameResult.isWin ? "🎉 זכית!" : "😔 הפסדת"}
                </p>
                <p className="text-lg text-gray-700">
                  בחרת: {gameResult.playerChoice === "tree" ? "עץ 🌳" : "פלי 🍃"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Choice Buttons */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Button
          size="lg"
          onClick={() => handlePlay("tree")}
          disabled={isPlaying || gameResult !== null}
          className="h-32 text-3xl font-bold bg-black hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-3 text-5xl">🌳</span>
          עץ
        </Button>
        <Button
          size="lg"
          onClick={() => handlePlay("leaf")}
          disabled={isPlaying || gameResult !== null}
          className="h-32 text-3xl font-bold bg-black hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-3 text-5xl">🍃</span>
          פלי
        </Button>
      </div>

      {/* Demo Notice */}
      <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6 text-center">
        <p className="text-lg text-gray-900 font-bold mb-3">
          💡 זה רק דמו להדגמה
        </p>
        <p className="text-sm text-gray-700 mb-4">
          כדי לזכות במוצרים אמיתיים - בחר מוצר ושלם 10% מהמחיר
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xl font-bold px-8 py-6"
        >
          בחר מוצר ושחק על אמת! 🎁
        </Button>
      </div>
    </div>
  );
}
