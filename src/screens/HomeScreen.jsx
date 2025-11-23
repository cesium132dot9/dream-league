// src/screens/HomeScreen.jsx
import whispDefaultImg from "../assets/whisp-default.png";
import whispStreakImg from "../assets/whisp-streak.png";
import { useState } from "react";
import whispImg from "../assets/whisp.png";
import snowflakeImg from "../assets/snowflake.png";

const friendsPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

function HomeScreen({ streak, freezes, setStreak, setFreeze, targetBedtime, sleepHistory, setSleepHistory, weeklyPoints, setWeeklyPoints, username = "Chen" }) {
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchWon, setMatchWon] = useState(false);
  const [opponentScore, setOpponentScore] = useState(0);
  const [userFinalScore, setUserFinalScore] = useState(0);
  const [showLogSleepPopup, setShowLogSleepPopup] = useState(false);
  const logSleepEntry = (status) => {
    setSleepHistory((history) => {
      // Reset history after completing a full week (7 entries)
      const isResettingWeek = history.length > 6;
      const currentHistory = isResettingWeek ? [] : history;

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

  // Check if it's Saturday and show match result
  const checkMatchDay = () => {
    const currentDayIndex = sleepHistory.length % 7;
    const isSaturday = currentDayIndex === 6;

    if (isSaturday) {
      // Save the final score before any reset
      setUserFinalScore(weeklyPoints);

      // Generate opponent score
      const randomIndex = Math.floor(Math.random() * friendsPoints.length);
      const randomNum = friendsPoints[randomIndex];
      setOpponentScore(randomNum);

      // Determine win/loss
      if (weeklyPoints >= randomNum) {
        setMatchWon(true);
        setFreeze((p) => p + 1);
      } else {
        setMatchWon(false);
      }
      
      // Show match result popup
      setShowMatchResult(true);
    }
  };

  const handleLogSleep = (status) => {
    // Check which day we're on (0=Sun, 1=Mon, ..., 6=Sat)
    const currentDayIndex = sleepHistory.length % 7;
    const isSaturday = currentDayIndex === 6;
    const isSunday = currentDayIndex === 0;
    const isStartingNewWeek = sleepHistory.length >= 7;

    // Reset weekly points when starting a new week (on Sunday)
    if (isSunday && isStartingNewWeek) {
      setWeeklyPoints(0);
    }

    // Handle different statuses
    if (status === 'good') {
      // Only award points Sunday through Friday
      if (!isSaturday) {
        const pointsEarned = streak > 0 ? 2 : 1;
        setWeeklyPoints((p) => p + pointsEarned);
      }
      setStreak((s) => s + 1);
    } else if (status === 'late') {
      setStreak(0);
    } else if (status === 'freeze') {
      if (freezes > 0) {
        setFreeze((p) => p - 1);
      } else {
        // Don't log if no freezes available
        setShowLogSleepPopup(false);
        return;
      }
    }

    // Check if it's Saturday and show match result
    checkMatchDay();

    // Log the entry and close popup
    logSleepEntry(status);
    setShowLogSleepPopup(false);
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

  // Calculate wake time from bedtime (assuming 8 hours of sleep)
  const calculateWakeTime = (bedtime) => {
    if (!bedtime) return "07:00";
    const [hours, minutes] = bedtime.split(":");
    let wakeHour = parseInt(hours, 10) + 8;
    if (wakeHour >= 24) wakeHour -= 24;
    return `${wakeHour.toString().padStart(2, "0")}:${minutes}`;
  };

  const wakeTime = calculateWakeTime(targetBedtime);

  // Get the current day of the week based on sleep history
  const getDayOfWeek = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = sleepHistory.length % 7;
    return days[dayIndex];
  };

  // Get the previous day's name for the log button
  const getPreviousDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayIndex = sleepHistory.length % 7;
    const previousDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
    return days[previousDayIndex];
  };

  return (
    <div className="h-full flex flex-col items-center px-5 pt-4 pb-5 overflow-y-auto">

      {/* Title */}
      <h1 
        className="font-header text-white mb-4 whitespace-nowrap"
        style={{
          fontSize: `clamp(1.25rem, ${Math.max(1.5, 2.5 - (username.length + getDayOfWeek().length) * 0.1)}rem, 2.25rem)`
        }}
      >
        {username}'s {getDayOfWeek()} Routine
      </h1>

      {/* ⭐ Mascot container like Talking Tom */}
      <div className="relative bg-white/5 rounded-3xl w-full flex-1 flex items-center justify-center shadow-inner border border-white/10 px-6 py-4">
        {streak >= 2 ? (
          <img
            src={whispStreakImg}
            alt="Whisp Streak"
            className="w-[200px] h-[200px] object-contain drop-shadow-xl"
          />
        ) : (
          <img
            src={whispDefaultImg}
            alt="Whisp"
            className="w-48 h-48 object-contain drop-shadow-xl"
          />
        )}
      </div>

      {/* Modular Sleep + streak info */}
      <div className="w-full mt-4 space-y-2">
        {/* Target cycle block - above streak/freeze */}
        <div className="rounded-2xl overflow-hidden flex">
          <div className="bg-gray-700 px-4 py-2 flex items-center">
            <p className="text-sm text-white font-medium">Target cycle</p>
          </div>
          <div className="bg-gray-600 px-4 py-2 flex items-center justify-end flex-1">
            <p className="text-base font-semibold text-white text-right">
              {formatTime(targetBedtime)} - {formatTime(wakeTime)}
            </p>
          </div>
        </div>

        {/* Top row: Streak block (large) and Snowflake block (small) */}
        <div className="flex gap-2 items-stretch">
          {/* Streak block - large, left */}
          <div className="flex-1 rounded-2xl overflow-hidden flex">
            <div className="px-4 py-3 flex items-center" style={{ backgroundColor: '#5B37B4', flexBasis: '70%' }}>
              <p className="text-2xl font-bold text-white">Streak</p>
            </div>
            <div className="px-4 py-3 flex items-center justify-center" style={{ backgroundColor: '#4A2A8A', flexBasis: '30%' }}>
              <p className="text-4xl font-bold text-white">{streak}</p>
            </div>
          </div>

          {/* Snowflake block - same height, top/bottom split */}
          <div className="w-20 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-2 py-1.5 flex items-center justify-center flex-1" style={{ backgroundColor: '#5BA3F5' }}>
              <img src={snowflakeImg} alt="Freeze" className="w-6 h-6 object-contain" />
            </div>
            <div className="px-2 py-1.5 flex items-center justify-center" style={{ backgroundColor: '#4A90E2' }}>
              <p className="text-2xl font-bold text-white">{freezes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Points for Match Day */}
      <div className="w-full rounded-2xl overflow-hidden flex mt-3">
        <div className="px-4 py-3 flex flex-col justify-center flex-1" style={{ backgroundColor: '#5B37B4' }}>
          <p className="text-2xl font-bold text-white">Weekly Points</p>
          <p className="text-xs text-white/60 mt-1">Earn points Sun-Fri</p>
        </div>
        <div className="px-4 py-3 flex items-center justify-center" style={{ backgroundColor: '#D4AF37', minWidth: '80px' }}>
          <p className="text-4xl font-bold text-white">{weeklyPoints}</p>
        </div>
      </div>

      {/* Log sleep button */}
      <div className="w-full mt-3">
        <button
          onClick={() => setShowLogSleepPopup(true)}
          className="w-full bg-black/30 hover:bg-black/40 rounded-2xl py-4 px-4 font-semibold text-white transition"
        >
          Log {getPreviousDay()}'s sleep
        </button>
      </div>

      {/* Log Sleep Popup */}
      {showLogSleepPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Log {getPreviousDay()}'s Sleep</h2>
              <p className="text-white/70 text-sm">How did you sleep?</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleLogSleep('good')}
                className="w-full bg-emerald-500/90 hover:bg-emerald-400 rounded-xl py-4 font-semibold text-white transition flex items-center justify-center gap-2"
              >
                <span className="text-xl">✅</span>
                <span>Good</span>
              </button>
              <button
                onClick={() => handleLogSleep('late')}
                className="w-full bg-rose-500/90 hover:bg-rose-400 rounded-xl py-4 font-semibold text-white transition flex items-center justify-center gap-2"
              >
                <span className="text-xl">❌</span>
                <span>Late</span>
              </button>
              <button
                onClick={() => handleLogSleep('freeze')}
                disabled={freezes === 0}
                className={`w-full rounded-xl py-4 font-semibold text-white transition flex items-center justify-center gap-2 ${
                  freezes > 0 
                    ? 'bg-sky-500/90 hover:bg-sky-400' 
                    : 'bg-gray-600/50 cursor-not-allowed opacity-50'
                }`}
              >
                <span className="text-xl">🧊</span>
                <span>Freeze {freezes > 0 ? `(${freezes} left)` : '(None available)'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowLogSleepPopup(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Match Result Popup */}
      {showMatchResult && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10 animate-fade-in">
            {matchWon ? (
              <>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">🏆</div>
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">Victory!</h2>
                  <p className="text-white/80 text-sm">You won this week's match!</p>
                </div>

                <div className="bg-black/30 rounded-2xl p-4 mb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Your Score:</span>
                    <span className="text-2xl font-bold text-yellow-400">{userFinalScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Opponent:</span>
                    <span className="text-2xl font-bold text-white/60">{opponentScore}</span>
                  </div>
                </div>

                <div className="bg-sky-500/20 rounded-2xl p-4 mb-4 border border-sky-400/30">
                  <p className="text-center text-sm text-white">
                    <span className="font-semibold text-sky-300">+1 Freeze</span> earned! 🧊
                  </p>
                  <p className="text-center text-xs text-white/70 mt-1">
                    Use it to protect your streak on a late night.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">😔</div>
                  <h2 className="text-3xl font-bold text-rose-400 mb-2">Close One!</h2>
                  <p className="text-white/80 text-sm">Better luck next week!</p>
                </div>

                <div className="bg-black/30 rounded-2xl p-4 mb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Your Score:</span>
                    <span className="text-2xl font-bold text-white/60">{userFinalScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Opponent:</span>
                    <span className="text-2xl font-bold text-yellow-400">{opponentScore}</span>
                  </div>
                </div>

                <div className="bg-rose-500/20 rounded-2xl p-4 mb-4 border border-rose-400/30">
                  <p className="text-center text-sm text-white">
                    Keep your streak going and try again next week! 💪
                  </p>
                </div>
              </>
            )}

            <button
              onClick={() => setShowMatchResult(false)}
              className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-white shadow-lg shadow-indigo-500/40 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default HomeScreen;
