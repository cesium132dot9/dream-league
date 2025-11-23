// src/screens/HistoryScreen.jsx
function HistoryScreen({ streak, sleepHistory, weeklyPoints, totalPoints }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize 7 empty slots for the week
  const displayEntries = Array(7).fill(null);

  // Calculate the start of this week (Sunday at 00:00:00)
  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const sundayDate = new Date(today);
  sundayDate.setDate(today.getDate() - todayDayOfWeek);
  sundayDate.setHours(0, 0, 0, 0);

  // Place each entry in its correct day slot if it's from this week
  sleepHistory.forEach((entry) => {
    const entryDate = new Date(entry.date);

    // Check if this entry is from this week (on or after this Sunday)
    if (entryDate >= sundayDate) {
      const entryDayOfWeek = entryDate.getDay();
      displayEntries[entryDayOfWeek] = entry;
    }
  });

  return (
    <div className="h-full p-5 space-y-4">
      <h1 className="text-xl font-semibold">Recent form</h1>
      <p className="text-sm text-white/70">
        Your last week of sleep!
      </p>

      <div className="mt-3 bg-black/30 rounded-2xl p-4 space-y-4">
        <div className="flex justify-between text-[11px] text-white/60">
          {days.map((d) => (
            <div key={d} className="w-7 flex justify-center">
              <span>{d}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {displayEntries.map((entry, idx) => {
            if (!entry) {
              // Empty slot - show a gray circle
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">
                    <span className="text-white/30">-</span>
                  </div>
                </div>
              );
            }

            const status = entry.status;
            const color =
              status === "good"
                ? "bg-emerald-400"
                : status === "freeze"
                ? "bg-sky-400"
                : "bg-rose-400";
            const emoji =
              status === "good" ? "✅" : status === "freeze" ? "🧊" : "❌";

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
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
          Keep it up! Win a match week (complete Saturday) to earn a Freeze that protects your streak on late nights.
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-4 text-sm space-y-2">
        <p className="font-semibold">Weekly Match Points</p>
        <p className="text-3xl font-bold text-yellow-400">{weeklyPoints} pts</p>
        <p className="text-white/70 text-xs">
          Earn points Sunday through Friday and see who has the most amount of points by Saturday!
        </p>
        <p className="text-white/70 text-xs">
          Earn 1 point for each time you sleep on schedule.
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-4 text-sm space-y-2">
        <p className="font-semibold">Total Points</p>
        <p className="text-3xl font-bold text-indigo-400">{totalPoints || 0} pts</p>
        <p className="text-white/70 text-xs">
          All-time points earned from sleeping on schedule.
        </p>
      </div>
    </div>
  );
}

export default HistoryScreen;
