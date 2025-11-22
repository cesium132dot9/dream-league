// src/screens/HomeScreen.jsx
import mascotImg from "../assets/mascot.png"; // <-- add your owl file here

function HomeScreen({ streak, flexPasses, setStreak, setFlexPasses }) {
  const handleMarkGood = () => {
    setStreak((s) => s + 1);
    if ((streak + 1) % 3 === 0) setFlexPasses((p) => p + 1);
  };

  const handleBreakStreak = () => setStreak(0);
  const handleUseFlex = () => {
    if (flexPasses > 0) setFlexPasses((p) => p - 1);
  };

  return (
    <div className="h-full flex flex-col items-center px-5 pt-4 pb-5 overflow-y-auto">
      
      {/* Title */}
      <h1 className="text-xl font-semibold mb-2">Tonight’s Routine</h1>

      {/* ⭐ Mascot container like Talking Tom */}
      <div className="relative bg-white/5 rounded-3xl w-full flex-1 flex items-center justify-center shadow-inner border border-white/10 px-6 py-4">
        <img
          src={mascotImg}
          alt="Mascot"
          className="w-48 h-48 object-contain drop-shadow-xl"
        />
      </div>

      {/* Sleep + streak info */}
      <div className="w-full bg-black/30 rounded-2xl p-4 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-white/60">Target bedtime</p>
            <p className="text-lg font-semibold">11:30 pm</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Streak</p>
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-xs text-sky-300 mt-1">
              Flex passes: {flexPasses}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons like “Task icons” */}
      <div className="w-full bg-black/30 rounded-2xl p-4 mt-3 space-y-3">
        <p className="text-xs text-white/60 text-center">
          Log your sleep outcome:
        </p>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <button
            onClick={handleMarkGood}
            className="bg-emerald-500/90 hover:bg-emerald-400 rounded-xl py-2 font-semibold"
          >
            ✅ Good
          </button>
          <button
            onClick={handleBreakStreak}
            className="bg-rose-500/90 hover:bg-rose-400 rounded-xl py-2 font-semibold"
          >
            ❌ Late
          </button>
          <button
            onClick={handleUseFlex}
            className="bg-sky-500/90 hover:bg-sky-400 rounded-xl py-2 font-semibold"
          >
            🧊 Flex
          </button>
        </div>
      </div>

    </div>
  );
}

export default HomeScreen;
