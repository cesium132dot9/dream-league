// src/screens/HomeScreen.jsx
import mascotImg from "../assets/mascot.png"; // <-- add your owl file here

function HomeScreen({ streak, freezes, setStreak, setFreeze, targetBedtime, sleepHistory, setSleepHistory, weeklyPoints, setWeeklyPoints }) {
  const logSleepEntry = (status) => {
    setSleepHistory((history) => {
      // Reset history after completing a full week (7 entries)
      const isResettingWeek = history.length >= 7;
      const currentHistory = isResettingWeek ? [] : history;

      // Reset weekly points when starting a new week
      if (isResettingWeek) {
        setWeeklyPoints(0);
      }

      // For demo: create dates starting from this week's Sunday
      const today = new Date();
      const todayDayOfWeek = today.getDay();
      const sundayDate = new Date(today);
      sundayDate.setDate(today.getDate() - todayDayOfWeek);
      sundayDate.setHours(0, 0, 0, 0);

      // Use the current history length to determine which day of the week (0-6)
      const dayIndex = currentHistory.length;
      const entryDate = new Date(sundayDate);
      entryDate.setDate(sundayDate.getDate() + dayIndex);

      // Add new entry
      return [...currentHistory, { date: entryDate.toISOString(), status }];
    });
  };

  const handleMarkGood = () => {
    // Check which day we're on (0=Sun, 1=Mon, ..., 6=Sat)
    const currentDayIndex = sleepHistory.length % 7;
    const isSaturday = currentDayIndex === 6;

    // Only award points Sunday through Friday
    if (!isSaturday) {
      const pointsEarned = streak > 0 ? 2 : 1;
      setWeeklyPoints((p) => p + pointsEarned);
    }

    setStreak((s) => s + 1);
    if ((streak + 1) % 3 === 0) setFreeze((p) => p + 1);
    logSleepEntry('good');
  };

  const handleBreakStreak = () => {
    setStreak(0);
    logSleepEntry('late');
  };

  const handleUseFreeze = () => {
    if (freezes > 0) {
      setFreeze((p) => p - 1);
      logSleepEntry('freeze');
    }
  };


  // Format time from 24-hour (e.g., "23:00") to 12-hour (e.g., "11:00 pm")
  const formatTime = (time) => {
    if (!time) return "11:00 pm";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "pm" : "am";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
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
            <p className="text-lg font-semibold">{formatTime(targetBedtime)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Streak</p>
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-xs text-sky-300 mt-1">
              Freezes: {freezes}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Points for Match Day */}
      <div className="w-full bg-black/30 rounded-2xl p-4 mt-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-white/60">Weekly Points</p>
            <p className="text-sm text-white/80">Earn points Sun-Fri</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-yellow-400">{weeklyPoints}</p>
            <p className="text-xs text-yellow-300">Match Day: Sat</p>
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
            onClick={handleUseFreeze}
            className="bg-sky-500/90 hover:bg-sky-400 rounded-xl py-2 font-semibold"
          >
            🧊 Freeze
          </button>
        </div>
      </div>

    </div>
  );
}

export default HomeScreen;
