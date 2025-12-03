import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

type Choice = "tree" | "leaf";

export default function DemoGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Choice | null>(null);
  const [isWin, setIsWin] = useState(false);
  const [demoWins, setDemoWins] = useState(0);

  const handlePlay = async (selectedChoice: Choice) => {
    if (isPlaying) return;

    setChoice(selectedChoice);
    setIsPlaying(true);
    setResult(null);

    // Simulate game delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo mode: 50% win rate for demonstration
    const winChance = Math.random() < 0.5;
    const gameResult: Choice = winChance ? selectedChoice : (selectedChoice === "tree" ? "leaf" : "tree");

    setResult(gameResult);
    setIsWin(winChance);

    if (winChance) {
      setDemoWins((prev) => prev + 1);
    }

    // Reset after showing result
    setTimeout(() => {
      setIsPlaying(false);
      setChoice(null);
      setResult(null);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-green-500 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          🎮 נסה את המשחק!
        </h3>
        <p className="text-gray-600">
          בחר עץ או פלי וראה אם זכית
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span className="font-bold text-yellow-900">
            זכיות בדמו: {demoWins}/5
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isPlaying && !result && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <Sparkles className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-700">
                בחר עץ או פלי למטה
              </p>
            </motion.div>
          )}

          {isPlaying && !result && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-center"
            >
              <div className="text-6xl">🎲</div>
              <p className="text-xl font-bold text-gray-700 mt-4">
                מגריל...
              </p>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-8xl mb-4"
              >
                {result === "tree" ? "🌳" : "🍃"}
              </motion.div>
              <p className={`text-2xl font-bold ${isWin ? "text-green-600" : "text-red-600"}`}>
                {isWin ? "🎉 זכית!" : "😔 הפסדת"}
              </p>
              <p className="text-gray-600 mt-2">
                {result === "tree" ? "יצא עץ" : "יצא פלי"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Choice Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          size="lg"
          onClick={() => handlePlay("tree")}
          disabled={isPlaying}
          className={`h-24 text-2xl font-bold transition-all ${
            choice === "tree"
              ? "bg-green-600 scale-95"
              : "bg-green-500 hover:bg-green-600 hover:scale-105"
          }`}
        >
          <span className="mr-2 text-4xl">🌳</span>
          עץ
        </Button>
        <Button
          size="lg"
          onClick={() => handlePlay("leaf")}
          disabled={isPlaying}
          className={`h-24 text-2xl font-bold transition-all ${
            choice === "leaf"
              ? "bg-emerald-600 scale-95"
              : "bg-emerald-500 hover:bg-emerald-600 hover:scale-105"
          }`}
        >
          <span className="mr-2 text-4xl">🍃</span>
          פלי
        </Button>
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-900 font-semibold mb-2">
          💡 זה רק דמו! כדי לזכות במוצרים אמיתיים:
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          בחר מוצר ושחק על אמת! 🎁
        </Button>
      </div>
    </div>
  );
}
