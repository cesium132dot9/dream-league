// src/screens/HomeScreen.jsx
import whispDefaultImg from "../assets/whisp-default.png";
import whispStreakImg from "../assets/whisp-streak.png";
import whispPitsDefaultImg from "../assets/whisp-pits-default.png";
import whispPitStreakImg from "../assets/whisp-pit-streak.png";
import whispSadImg from "../assets/whisp-sad.png";
import whispPitsSadImg from "../assets/whisp-pits-sad.png";
import napsterHappyImg from "../assets/napster-happy.png";
import napsterDefaultImg from "../assets/napster-default.png";
import napsterStreakImg from "../assets/napster-streak.png";
import napsterSadImg from "../assets/napster-sad.png";
import dozerHappyImg from "../assets/dozer-happy.png";
import dozerDefaultImg from "../assets/dozer-happy.png";
import dozerStreakImg from "../assets/dozer-streak.png";
import dozerSadImg from "../assets/dozer-sad.png";
import { useState, useEffect, useRef } from "react";
import whispImg from "../assets/whisp.png";

const friendsPoints = [0, 1, 2, 3, 4, 5, 6]

function HomeScreen({ streak, freezes, setStreak, setFreeze, targetBedtime, sleepHistory, setSleepHistory, weeklyPoints, setWeeklyPoints, totalPoints, setTotalPoints, username = "Chen", selectedOutfit = "default", showSad = false, unlockedOutfits = new Set(["default"]), onNavigateToCustomize, onMatchdayComplete }) {
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchWon, setMatchWon] = useState(false);
  const [opponentScore, setOpponentScore] = useState(0);
  const [userFinalScore, setUserFinalScore] = useState(0);
  const [speechBubble, setSpeechBubble] = useState("");
  const [showDailyRecap, setShowDailyRecap] = useState(false);
  const [recapData, setRecapData] = useState(null);
  const previousValuesRef = useRef({ streak: 0, weeklyPoints: 0, unlockedOutfits: new Set(["default"]) });
  const [isSaturdayRecap, setIsSaturdayRecap] = useState(false);
  const shouldResetPointsRef = useRef(false);
  const [showNoFreezesPopup, setShowNoFreezesPopup] = useState(false);
  const [hasShownFirstDayTransition, setHasShownFirstDayTransition] = useState(false);
  // Show transition immediately on first load if no sleep history
  const [showDayTransition, setShowDayTransition] = useState(sleepHistory.length === 0);

  // Speech bubble messages
  const speechMessages = {
    goodLowStreak: [
      `Yay! Keep it going, ${username}!`,
      "Keep at it!",
      `A well-rested ${username} is the best ${username}!`,
      "Let's win this matchweek!"
    ],
    goodHighStreak: [
      "We're on a roll!",
      "Keep the streak going!",
      "Don't let the streak die!",
      "Let's win this matchweek!",
      `No stopping us, ${username}!`
    ],
    late: [
      "It's okay... let's try again!",
      "Awe, man...",
      "I feel groggy today..."
    ],
    freeze: [
      "Brrr! Snow day!",
      "🎶 Let it go...",
      "FREEZE!"
    ]
  };

  // Show first day transition when user first arrives
  useEffect(() => {
    if (sleepHistory.length === 0 && !hasShownFirstDayTransition) {
      setHasShownFirstDayTransition(true);
      setTimeout(() => {
        setShowDayTransition(false);
      }, 2500);
    }
  }, [sleepHistory.length, hasShownFirstDayTransition]);

  // Get the last sleep outcome and set speech bubble
  useEffect(() => {
    if (sleepHistory.length === 0) {
      // Default message if no history
      setSpeechBubble("Let's get started!");
      return;
    }

    const lastEntry = sleepHistory[sleepHistory.length - 1];
    const lastStatus = lastEntry?.status;

    let messages = [];
    
    if (lastStatus === 'good') {
      if (streak <= 2) {
        messages = speechMessages.goodLowStreak;
      } else {
        messages = speechMessages.goodHighStreak;
      }
    } else if (lastStatus === 'late') {
      messages = speechMessages.late;
    } else if (lastStatus === 'freeze') {
      messages = speechMessages.freeze;
    } else {
      messages = ["Let's do this!"];
    }

    // Randomly select a message
    const randomIndex = Math.floor(Math.random() * messages.length);
    setSpeechBubble(messages[randomIndex]);
  }, [sleepHistory, streak, username]);

  // Reset weekly points on Saturday after match popup is closed and useEffect has run
  useEffect(() => {
    // If isSaturdayRecap is true, it means we were on Saturday when the match was triggered
    // Only reset if the match popup was just closed and we have the flag set
    if (isSaturdayRecap && !showMatchResult && shouldResetPointsRef.current) {
      // Use setTimeout to ensure this runs after other state updates from the speech bubble useEffect
      setTimeout(() => {
        // Call handleCloseMatchPopup to reset weekly points for the new week
        // handleCloseMatchPopup only uses setWeeklyPoints which is stable, so it's safe to omit from deps
        handleCloseMatchPopup();
        shouldResetPointsRef.current = false;
      }, 0);
    } else if (!isSaturdayRecap && !showMatchResult) {
      // Clear the flag if we're not on Saturday to prevent accidental resets
      shouldResetPointsRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleepHistory, showMatchResult, weeklyPoints, isSaturdayRecap]);
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
      // Set flag to indicate we're on Saturday/matchday
      setIsSaturdayRecap(true);
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
    // Store previous values before changes
    const prevStreak = streak;
    const prevWeeklyPoints = weeklyPoints;
    const prevUnlockedOutfits = new Set(unlockedOutfits);
    
    // Check which day we're on (0=Sun, 1=Mon, ..., 6=Sat)
    const currentDayIndex = sleepHistory.length % 7;
    const isSaturday = currentDayIndex === 6;

    // Only award points Sunday through Friday
    let pointsEarned = 0;
    if (!isSaturday) {
      const pointsEarned = 1; // Always 1 point for sleeping on schedule
      setWeeklyPoints((p) => p + pointsEarned);
      setTotalPoints((p) => p + pointsEarned);
    }

    // Check if it's Saturday and show match result
    checkMatchDay();

    setStreak((s) => s + 1);
    logSleepEntry('good');
    
    // Show daily recap after state updates (unless it's Saturday)
    if (!isSaturday) {
      setTimeout(() => {
        const newStreak = prevStreak + 1;
        const newWeeklyPoints = prevWeeklyPoints + pointsEarned;
        // Calculate new unlocked outfits based on new streak
        const newUnlockedOutfits = new Set(prevUnlockedOutfits);
        outfitRequirements.forEach((outfit) => {
          if (newStreak >= outfit.requiredStreak) {
            newUnlockedOutfits.add(outfit.id);
          }
        });
        showDailyRecapPopup(prevStreak, newStreak, prevWeeklyPoints, newWeeklyPoints, prevUnlockedOutfits, newUnlockedOutfits);
      }, 100);
    }
  };

  const handleBreakStreak = () => {
    // Store previous values
    const prevStreak = streak;
    const prevWeeklyPoints = weeklyPoints;
    const prevUnlockedOutfits = new Set(unlockedOutfits);
    
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
    
    // Show daily recap after state updates (unless it's Saturday)
    if (!isSaturday) {
      setTimeout(() => {
        // Calculate new unlocked outfits based on new streak (0)
        const newUnlockedOutfits = new Set(prevUnlockedOutfits);
        outfitRequirements.forEach((outfit) => {
          if (0 >= outfit.requiredStreak) {
            newUnlockedOutfits.add(outfit.id);
          }
        });
        showDailyRecapPopup(prevStreak, 0, prevWeeklyPoints, weeklyPoints, prevUnlockedOutfits, newUnlockedOutfits);
      }, 100);
    }
  };

  const handleUseFreeze = () => {
    if (freezes > 0) {
      // Store previous values
      const prevStreak = streak;
      const prevWeeklyPoints = weeklyPoints;
      const prevFreezes = freezes;
      const prevUnlockedOutfits = new Set(unlockedOutfits);
      
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

      setFreeze((p) => p - 1);
      logSleepEntry('freeze');
      
      // Show daily recap after state updates (unless it's Saturday)
      if (!isSaturday) {
        setTimeout(() => {
          // Freeze doesn't change streak, so unlocked outfits stay the same
          showDailyRecapPopup(prevStreak, streak, prevWeeklyPoints, weeklyPoints, prevUnlockedOutfits, prevUnlockedOutfits, null, null, null, true, prevFreezes, freezes - 1);
        }, 100);
      }
    } else {
      // Show popup when user has no freezes
      setShowNoFreezesPopup(true);
    }
  };

  // Handle closing the match result popup
  // This function resets weekly points after the match popup is closed on Saturday
  const handleCloseMatchPopup = () => {
    // Reset weekly points for the new week
    setWeeklyPoints(0);
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

  // Get the previous day's name for the log button
  const getPreviousDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayIndex = sleepHistory.length % 7;
    const previousDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
    return days[previousDayIndex];
  };

  // Get the day we just logged sleep for (the previous day)
  const getJustLoggedDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // After logging sleep, sleepHistory.length increases, so the day we just logged is the previous day
    const currentDayIndex = sleepHistory.length % 7;
    const previousDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
    return days[previousDayIndex];
  };

  // Outfit requirements
  const outfitRequirements = [
    { id: "default", label: "Whisp", requiredStreak: 0 },
    { id: "pit", label: "Hack Whisp-stern", requiredStreak: 3 },
    { id: "blue", label: "Napster", requiredStreak: 7 },
    { id: "gold", label: "Dozer", requiredStreak: 14 },
  ];

  // Show daily recap popup
  const showDailyRecapPopup = (prevStreak, newStreak, prevWeeklyPoints, newWeeklyPoints, prevUnlockedOutfits, newUnlockedOutfits, matchWon = null, userFinalScore = null, opponentScore = null, usedFreeze = false, prevFreezes = null, newFreezes = null) => {
    // Find newly unlocked outfits
    const newlyUnlocked = [];
    outfitRequirements.forEach((outfit) => {
      if (!prevUnlockedOutfits.has(outfit.id) && newUnlockedOutfits.has(outfit.id)) {
        newlyUnlocked.push(outfit);
      }
    });

    // Find next outfit to unlock
    let nextOutfit = null;
    let daysToUnlock = null;
    outfitRequirements.forEach((outfit) => {
      if (!newUnlockedOutfits.has(outfit.id)) {
        if (!nextOutfit || outfit.requiredStreak < nextOutfit.requiredStreak) {
          nextOutfit = outfit;
        }
      }
    });

    if (nextOutfit) {
      daysToUnlock = Math.max(0, nextOutfit.requiredStreak - newStreak);
    }

    // Get the day being recapped (previous day)
    const recapDay = getPreviousDay();

    setRecapData({
      streakChanged: prevStreak !== newStreak,
      prevStreak,
      newStreak,
      weeklyPointsChanged: prevWeeklyPoints !== newWeeklyPoints,
      prevWeeklyPoints,
      newWeeklyPoints,
      newlyUnlocked,
      nextOutfit,
      daysToUnlock,
      matchWon,
      userFinalScore,
      opponentScore,
      usedFreeze,
      prevFreezes,
      newFreezes,
      recapDay,
    });
    setShowDailyRecap(true);
  };


  return (
    <>
      {/* Day Transition Screen - Show first, before home content */}
      {showDayTransition && (
        <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 to-slate-900 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3">
              {getDayOfWeek()} Morning
            </h1>
            <p className="text-xl text-white/70">
              {sleepHistory.length === 0 
                ? "Welcome! Let's start your sleep journey."
                : `Enter ${getJustLoggedDay()}'s sleep`}
            </p>
          </div>
        </div>
      )}
      
      {/* Home Screen Content - Hidden when transition is showing */}
      <div className={`h-full flex flex-col items-center px-5 pt-4 pb-5 overflow-y-auto ${showDayTransition ? 'opacity-0 pointer-events-none' : ''}`}>
      
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
      <div className="relative bg-white/5 rounded-3xl w-full flex-1 flex flex-col items-center justify-end shadow-inner border border-white/10 px-6 py-4 pb-8 min-h-0">
        {/* Speech Bubble */}
        {speechBubble && (
          <div className="relative mb-3 w-full max-w-xs">
            {/* Speech bubble */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-sm border border-white/10">
              <p className="text-sm text-white text-center">
                {speechBubble}
              </p>
            </div>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-3 bg-white/20 backdrop-blur-sm transform rotate-45 border-l border-b border-white/10"></div>
            </div>
          </div>
        )}
        
        {/* Character */}
        {(() => {
          const isStreak = streak >= 2;
          let imageSrc;
          let imageSize;
          
          // Show sad images if streak was just lost
          if (showSad) {
            if (selectedOutfit === "pit") {
              imageSrc = whispPitsSadImg;
            } else if (selectedOutfit === "blue") {
              imageSrc = napsterSadImg;
            } else if (selectedOutfit === "gold") {
              imageSrc = dozerSadImg;
            } else {
              imageSrc = whispSadImg;
            }
            imageSize = "w-48 h-48";
          } else if (selectedOutfit === "pit") {
            imageSrc = isStreak ? whispPitStreakImg : whispPitsDefaultImg;
            imageSize = isStreak ? "w-[200px] h-[200px]" : "w-48 h-48";
          } else if (selectedOutfit === "blue") {
            // Napster
            imageSrc = isStreak ? napsterStreakImg : napsterDefaultImg;
            imageSize = isStreak ? "w-[200px] h-[200px]" : "w-48 h-48";
          } else if (selectedOutfit === "gold") {
            // Dozer
            imageSrc = isStreak ? dozerStreakImg : dozerDefaultImg;
            imageSize = isStreak ? "w-[200px] h-[200px]" : "w-48 h-48";
          } else {
            // Default outfit (Whisp)
            imageSrc = isStreak ? whispStreakImg : whispDefaultImg;
            imageSize = isStreak ? "w-[200px] h-[200px]" : "w-48 h-48";
          }
          
          return (
            <img
              src={imageSrc}
              alt="Character"
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
          Log {getPreviousDay()}'s sleep outcome:
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


      {/* No Freezes Popup */}
      {showNoFreezesPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10 animate-fade-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🧊</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Freezes Remaining</h2>
              <p className="text-white/70 text-sm">You don't have any freezes to use right now.</p>
            </div>

            <div className="bg-sky-500/20 rounded-2xl p-4 mb-6 border border-sky-400/30">
              <p className="text-center text-sm text-white mb-2">
                <span className="font-semibold text-sky-300">How to earn a Freeze:</span>
              </p>
              <p className="text-center text-xs text-white/70">
                Win a matchweek on Saturday! Complete your sleep schedule Sunday through Friday, then beat your opponent on Matchday Saturday to earn +1 Freeze.
              </p>
            </div>

            <button
              onClick={() => setShowNoFreezesPopup(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 font-semibold text-white transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Daily Recap Popup */}
      {showDailyRecap && recapData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Daily Recap</h2>
              <p className="text-white/70 text-sm">{recapData.recapDay}'s Summary</p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Streak update */}
              {(recapData.streakChanged || recapData.matchWon !== null || recapData.usedFreeze) && (
                <div className="bg-black/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Streak</span>
                    <div className="flex items-center gap-2">
                      {recapData.streakChanged && !recapData.usedFreeze ? (
                        <>
                          <span className="text-white/60">{recapData.prevStreak}</span>
                          <span className="text-white">→</span>
                        </>
                      ) : null}
                      <span className="text-2xl font-bold text-indigo-400">{recapData.newStreak}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Freeze used message */}
              {recapData.usedFreeze && (
                <div className="bg-sky-500/20 rounded-2xl p-4 border border-sky-400/30">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">🧊</div>
                    <p className="text-sm font-semibold text-sky-300">Freeze Used!</p>
                    <p className="text-xs text-white/70 mt-1">Your streak was protected</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Streak</span>
                      <span className="text-lg font-bold text-indigo-400">Protected at {recapData.newStreak}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Weekly Points</span>
                      <span className="text-lg font-bold text-white/60">No change ({recapData.newWeeklyPoints})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">Freezes Remaining</span>
                      <span className="text-lg font-bold text-sky-300">{recapData.newFreezes}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Weekly Points update or reset message (Saturday) */}
              {!recapData.usedFreeze && recapData.matchWon !== null ? (
                // Saturday: Show weekly points reset message
                <div className="bg-indigo-500/20 rounded-2xl p-4 border border-indigo-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Weekly Points</span>
                    <span className="text-2xl font-bold text-yellow-400">{recapData.prevWeeklyPoints}</span>
                  </div>
                  <p className="text-xs text-white/70 text-center mt-2">
                    Weekly points will reset as we start a new week!
                  </p>
                </div>
              ) : (
                // Other days: Show weekly points update (only if freeze wasn't used)
                !recapData.usedFreeze && recapData.weeklyPointsChanged && (
                  <div className="bg-black/30 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Weekly Points</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">{recapData.prevWeeklyPoints}</span>
                        <span className="text-white">→</span>
                        <span className="text-2xl font-bold text-yellow-400">{recapData.newWeeklyPoints}</span>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Newly unlocked outfits */}
              {recapData.newlyUnlocked.length > 0 && (
                <div className="bg-indigo-500/20 rounded-2xl p-4 border border-indigo-400/30">
                  <p className="text-center text-sm text-white mb-2">
                    <span className="font-semibold text-indigo-300">🎉 New Outfit Unlocked!</span>
                  </p>
                  {recapData.newlyUnlocked.map((outfit) => (
                    <p key={outfit.id} className="text-center text-sm text-white font-semibold">
                      {outfit.label}
                    </p>
                  ))}
                </div>
              )}

              {/* Next outfit to unlock */}
              {recapData.nextOutfit && recapData.daysToUnlock !== null && (
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  {recapData.daysToUnlock === 0 ? (
                    <p className="text-center text-sm text-white">
                      <span className="font-semibold">You're ready to unlock {recapData.nextOutfit.label}!</span>
                    </p>
                  ) : (
                    <p className="text-center text-sm text-white">
                      Keep your streak for <span className="font-semibold text-indigo-300">{recapData.daysToUnlock} more day{recapData.daysToUnlock !== 1 ? 's' : ''}</span> to unlock <span className="font-semibold">{recapData.nextOutfit.label}</span>!
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {recapData.newlyUnlocked.length > 0 && onNavigateToCustomize && (
                <button
                  onClick={() => {
                    setShowDailyRecap(false);
                    onNavigateToCustomize();
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-semibold text-white shadow-lg shadow-emerald-500/40 transition"
                >
                  Locker
                </button>
              )}
              <button
                onClick={() => {
                  setShowDailyRecap(false);
                  setIsSaturdayRecap(false);
                  // Show day transition
                  setShowDayTransition(true);
                  // Hide transition after 2.5 seconds
                  setTimeout(() => {
                    setShowDayTransition(false);
                  }, 2500);
                }}
                className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-white shadow-lg shadow-indigo-500/40 transition"
              >
                Come back tomorrow
              </button>
            </div>
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
              onClick={() => {
                // Store match result data before closing (match result only shows on Saturday)
                const matchResultData = {
                  matchWon,
                  userFinalScore,
                  opponentScore,
                };
                
                // If isSaturdayRecap is true, it means we were on Saturday when the match was triggered
                // Only set flag to reset points if we were on Saturday/matchday
                if (isSaturdayRecap) {
                  shouldResetPointsRef.current = true;
                  // Update fake users on matchday - pass userFinalScore which is the weeklyPoints before reset
                  if (onMatchdayComplete) {
                    onMatchdayComplete(userFinalScore);
                  }
                }
                setShowMatchResult(false);
                
                // Always show daily recap after match result (match result only appears on Saturday)
                // Store previous values for recap - need to get values before the sleep entry was logged
                // Since we're on Saturday, the previous day index was 5 (Friday)
                // But we need to get the values from before logging today's entry
                const prevStreak = streak;
                const prevWeeklyPoints = userFinalScore; // Use the saved final score before any changes
                const prevUnlockedOutfits = new Set(unlockedOutfits);
                
                setTimeout(() => {
                  const newStreak = streak;
                  const newWeeklyPoints = weeklyPoints; // This will be reset for the new week
                  // Calculate new unlocked outfits based on current streak
                  const newUnlockedOutfits = new Set(prevUnlockedOutfits);
                  outfitRequirements.forEach((outfit) => {
                    if (newStreak >= outfit.requiredStreak) {
                      newUnlockedOutfits.add(outfit.id);
                    }
                  });
                  
                  setIsSaturdayRecap(true);
                  showDailyRecapPopup(
                    prevStreak, 
                    newStreak, 
                    prevWeeklyPoints, 
                    newWeeklyPoints, 
                    prevUnlockedOutfits, 
                    newUnlockedOutfits, 
                    matchResultData.matchWon, 
                    matchResultData.userFinalScore, 
                    matchResultData.opponentScore
                  );
                }, 100);
              }}
              className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-white shadow-lg shadow-indigo-500/40 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default HomeScreen;
