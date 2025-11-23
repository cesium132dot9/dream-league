// src/App.jsx
import { useState, useEffect, useRef } from "react";
import OnboardingScreen from "./screens/OnboardingScreen";
import HomeScreen from "./screens/HomeScreen";
import LeagueScreen from "./screens/LeagueScreen";
import LeagueLeaderboardScreen from "./screens/LeagueLeaderboardScreen";
import HistoryScreen from "./screens/HistoryScreen";
import CustomizeScreen from "./screens/CustomizeScreen";
import BottomNav from "./components/BottomNav";

function App() {
  const [currentScreen, setCurrentScreen] = useState("onboarding");
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [username, setUsername] = useState("Chen"); // Default username

  // demo state – later you can wire this up properly
  const [streak, setStreak] = useState(0);
  const [freezes, setFreeze] = useState(2);
  const [targetBedtime, setTargetBedtime] = useState("23:30");
  const [sleepHistory, setSleepHistory] = useState([]); // Array of {date, status: 'good'|'late'|'freeze'}
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [selectedOutfit, setSelectedOutfit] = useState("default"); // "default", "pit", etc.
  const [unlockedOutfits, setUnlockedOutfits] = useState(new Set(["default"])); // Permanently unlocked outfits
  const [showSad, setShowSad] = useState(false); // Show sad character after streak is lost
  const previousStreakRef = useRef(0); 
  const [totalPoints, setTotalPoints] = useState(0); // Total points earned this season
  const [joinedLeagues, setJoinedLeagues] = useState([]); // Leagues the user has joined
  const [selectedLeague, setSelectedLeague] = useState(null); // League selected for leaderboard view 

  const handleCompleteOnboarding = (onboardingData) => {
    // Store onboarding data (you can use this later for app blocking, schedule, etc.)
    console.log("Onboarding complete:", onboardingData);
    setTargetBedtime(onboardingData.bedtime);
    if (onboardingData.username) {
      setUsername(onboardingData.username);
    }
    setHasOnboarded(true);
    setCurrentScreen("home");
  };

  // Unlock outfits permanently when streak reaches requirements
  useEffect(() => {
    const outfitRequirements = [
      { id: "default", requiredStreak: 0 },
      { id: "pit", requiredStreak: 3 },
      { id: "blue", requiredStreak: 7 },
      { id: "gold", requiredStreak: 14 },
    ];

    outfitRequirements.forEach(({ id, requiredStreak }) => {
      if (streak >= requiredStreak) {
        setUnlockedOutfits((prev) => {
          const newSet = new Set(prev);
          newSet.add(id);
          return newSet;
        });
      }
    });
  }, [streak]);

  // Detect when streak is lost and show sad character
  useEffect(() => {
    const previousStreak = previousStreakRef.current;
    
    // If streak goes from > 0 to 0, show sad character
    if (previousStreak > 0 && streak === 0) {
      setShowSad(true);
    }
    
    // If streak is regained (goes from 0 to > 0), hide sad character
    // This happens when user clicks "good" after losing streak
    if (showSad && streak > 0) {
      setShowSad(false);
    }
    
    // Update previous streak ref
    previousStreakRef.current = streak;
  }, [streak, showSad]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      {/* Phone frame */}
      <div className="w-[390px] h-[800px] bg-gradient-to-b from-indigo-900 to-slate-900 text-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">
        {/* Fake status bar */}
        <div className="h-10 flex items-center justify-between px-4 text-xs text-white/70 bg-black/20">
          <span>Dream League</span>
          <span>🕒 9:41</span>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden">
          {currentScreen === "onboarding" && (
            <OnboardingScreen onComplete={handleCompleteOnboarding} />
          )}
          {currentScreen === "home" && (
            <HomeScreen
              streak={streak}
              freezes={freezes}
              setStreak={setStreak}
              setFreeze={setFreeze}
              targetBedtime={targetBedtime}
              sleepHistory={sleepHistory}
              setSleepHistory={setSleepHistory}
              weeklyPoints={weeklyPoints}
              setWeeklyPoints={setWeeklyPoints}
              totalPoints={totalPoints}
              setTotalPoints={setTotalPoints}
              username={username}
              selectedOutfit={selectedOutfit}
              showSad={showSad}
              unlockedOutfits={unlockedOutfits}
              onNavigateToCustomize={() => setCurrentScreen("customize")}
            />
          )}
          {currentScreen === "league" && (
            <LeagueScreen
              username={username}
              weeklyPoints={weeklyPoints}
              totalPoints={totalPoints}
              joinedLeagues={joinedLeagues}
              setJoinedLeagues={setJoinedLeagues}
              onViewLeaderboard={(league) => {
                setSelectedLeague(league);
                setCurrentScreen("leaderboard");
              }}
            />
          )}
          {currentScreen === "leaderboard" && selectedLeague && (
            <LeagueLeaderboardScreen
              league={selectedLeague}
              username={username}
              weeklyPoints={weeklyPoints}
              totalPoints={totalPoints}
              onBack={() => setCurrentScreen("league")}
            />
          )}
          {currentScreen === "history" && (
            <HistoryScreen streak={streak} sleepHistory={sleepHistory} weeklyPoints={weeklyPoints} />
          )}
          {currentScreen === "customize" && (
            <CustomizeScreen 
              streak={streak} 
              selectedOutfit={selectedOutfit} 
              setSelectedOutfit={setSelectedOutfit}
              unlockedOutfits={unlockedOutfits}
            />
          )}
        </div>

        {/* Bottom nav only after onboarding */}
        {hasOnboarded && (
          <BottomNav
            currentScreen={currentScreen}
            setCurrentScreen={setCurrentScreen}
          />
        )}
      </div>
    </div>
  );
}

export default App;
