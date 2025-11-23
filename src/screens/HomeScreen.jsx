// src/screens/HomeScreen.jsx
import whispDefaultImg from "../assets/whisp-default.png";
import whispStreakImg from "../assets/whisp-streak.png";
import whispPitsDefaultImg from "../assets/whisp-pits-default.png";
import whispPitStreakImg from "../assets/whisp-pit-streak.png";
import { useState } from "react";
import whispImg from "../assets/whisp.png";

const friendsPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

function HomeScreen({ streak, freezes, setStreak, setFreeze, targetBedtime, sleepHistory, setSleepHistory, weeklyPoints, setWeeklyPoints, username = "Chen", selectedOutfit = "default" }) {
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchWon, setMatchWon] = useState(false);
  const [opponentScore, setOpponentScore] = useState(0);
  const [userFinalScore, setUserFinalScore] = useState(0);
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

  const handleMarkGood = () => {
    // Check which day we're on (0=Sun, 1=Mon, ..., 6=Sat)
    const currentDayIndex = sleepHistory.length % 7;
    const isSaturday = currentDayIndex === 6;
    const isSunday = currentDayIndex === 0;
    const isStartingNewWeek = sleepHistory.length >= 7;

    // Reset weekly points when starting a new week (on Sunday)
    if (isSunday && isStartingNewWeek) {
      setWeeklyPoints(0);
    }

    // Only award points Sunday through Friday
    if (!isSaturday) {
      const pointsEarned = streak > 0 ? 2 : 1;
      setWeeklyPoints((p) => p + pointsEarned);
    }

    // Check if it's Saturday and show match result
    checkMatchDay();

    setStreak((s) => s + 1);
    logSleepEntry('good');
  };

  const handleBreakStreak = () => {
    // Check which day we're on (0=Sun, 1=Mon, ..., 6=Sat)
    const currentDayIndex = sleepHistory.length % 7;
    const isSaturday = currentDayIndex === 6; 
    const isSunday = currentDayIndex === 0;
    const isStartingNewWeek = sleepHistory.length >= 7;

    // Reset weekly points when starting a new week (on Sunday)
    if (isSunday && isStartingNewWeek) {
      setWeeklyPoints(0);
    }

    // Check if it's Saturday and show match result
    checkMatchDay();

    setStreak(0);
    logSleepEntry('late');
  };

  const handleUseFreeze = () => {
    if (freezes > 0) {
      // Check which day we're on (0=Sun, 1=Mon, ..., 6=Sat)
      const currentDayIndex = sleepHistory.length % 7;
      const isSunday = currentDayIndex === 0;
      const isStartingNewWeek = sleepHistory.length >= 7;

      // Reset weekly points when starting a new week (on Sunday)
      if (isSunday && isStartingNewWeek) {
        setWeeklyPoints(0);
      }

      // Check if it's Saturday and show match result
      checkMatchDay();

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


  // Get the current day of the week based on sleep history
  const getDayOfWeek = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = sleepHistory.length % 7;
    return days[dayIndex];
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
        {(() => {
          const isStreak = streak >= 2;
          let imageSrc;
          let imageSize;
          
          if (selectedOutfit === "pit") {
            imageSrc = isStreak ? whispPitStreakImg : whispPitsDefaultImg;
            imageSize = isStreak ? "w-[200px] h-[200px]" : "w-48 h-48";
          } else {
            // Default outfit
            imageSrc = isStreak ? whispStreakImg : whispDefaultImg;
            imageSize = isStreak ? "w-[200px] h-[200px]" : "w-48 h-48";
          }
          
          return (
            <img
              src={imageSrc}
              alt="Whisp"
              className={`${imageSize} object-contain drop-shadow-xl`}
            />
          );
        })()}
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
            <p className="text-xs text-yellow-300">Matchday: Sat</p>
          </div>
        </div>
      </div>

      {/* Buttons like "Task icons" */}
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
