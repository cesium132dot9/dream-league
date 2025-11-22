// src/screens/HomeScreen.jsx
import MascotCard from "../components/MascotCard";

function HomeScreen({ streak, flexPasses, setStreak, setFlexPasses }) {
  const handleMarkGood = () => {
    // simple demo logic
    setStreak((s) => s + 1);
    if ((streak + 1) % 3 === 0) {
      setFlexPasses((p) => p + 1);
    }
  };

  const handleBreakStreak = () => {
    setStreak(0);
  };

  const handleUseFlex = () => {
    if (flexPasses > 0) {
      setFlexPasses((p) => p - 1);
      // streak stays the same
    }
  };

  return (
    <div className="h-full flex flex-col p-5 gap-4">
      <h1 className="text-xl font-semibold">Tonight&apos;s game plan</h1>

      <MascotCard streak={streak} />

      {/* Sleep info */}
      <div className="bg-black/30 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/60">Target bedtime</p>
          <p className="text-lg font-semibold">11:30 pm</p>
          <p className="text-xs text-white/60 mt-1">
            Wake up at <span className="font-medium">7:30 am</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">Current streak</p>
          <p className="text-2xl font-bold">{streak}️⃣</p>
          <p className="text-xs text-emerald-300 mt-1">
            Flex passes: {flexPasses}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <p className="text-xs text-white/70 mb-1">
          When you wake up tomorrow, tap how the night went:
        </p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <button
            onClick={handleMarkGood}
            className="bg-emerald-500/90 hover:bg-emerald-400 rounded-xl py-2 px-2 font-semibold"
          >
            ✅ On time
          </button>
          <button
            onClick={handleBreakStreak}
            className="bg-rose-500/90 hover:bg-rose-400 rounded-xl py-2 px-2 font-semibold"
          >
            ❌ Broke it
          </button>
          <button
            onClick={handleUseFlex}
            className="bg-sky-500/90 hover:bg-sky-400 rounded-xl py-2 px-2 font-semibold"
          >
            🧊 Use Flex
          </button>
        </div>
      </div>

      {/* Fake app lock demo */}
      <div className="bg-black/30 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-white/70">
          Try opening a “blocked” app during sleep:
        </p>
        <button className="w-full bg-white/5 hover:bg-white/10 rounded-xl py-2 text-sm flex items-center justify-center gap-2">
          📱 Open TikTok (demo)
        </button>
        <p className="text-[11px] text-white/50">
          In a real version, we&apos;d intercept late‑night openings and gently
          block them or spend a Flex Pass.
        </p>
      </div>
    </div>
  );
}

export default HomeScreen;
