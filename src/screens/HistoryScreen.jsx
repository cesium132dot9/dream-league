// src/screens/HistoryScreen.jsx
function HistoryScreen({ streak }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="h-full p-5 space-y-4">
      <h1 className="text-xl font-semibold">Recent form</h1>
      <p className="text-sm text-white/70">
        Your last week of “matches”. Green = on time, blue = Flex pass, red =
        broken streak.
      </p>

      <div className="mt-3 bg-black/30 rounded-2xl p-4 space-y-4">
        <div className="flex justify-between text-[11px] text-white/60">
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="flex justify-between">
          {days.map((d, idx) => {
            // fake pattern for demo
            const status = idx < 3 ? "good" : idx === 3 ? "freeze" : "bad";
            const color =
              status === "good"
                ? "bg-emerald-400"
                : status === "freeze"
                ? "bg-sky-400"
                : "bg-rose-400";
            const emoji =
              status === "good" ? "✅" : status === "freeze" ? "🧊" : "❌";

            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-xs`}>
                  {emoji}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-black/30 rounded-2xl p-4 text-sm space-y-2">
        <p className="font-semibold">Current streak</p>
        <p className="text-3xl font-bold">{streak} days</p>
        <p className="text-white/70 text-xs">
          Keep it up! Every 3 days you earn a Flex Pass to protect your streak
          on late nights.
        </p>
      </div>
    </div>
  );
}

export default HistoryScreen;
