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
  
  // Leaderboard points - only update on matchday
  const [leaderboardWeeklyPoints, setLeaderboardWeeklyPoints] = useState(0);
  const [leaderboardTotalPoints, setLeaderboardTotalPoints] = useState(0);
  
  // Fake users for leaderboard - all start at 0, accumulate points on matchday
  const [fakeUsers, setFakeUsers] = useState(() => {
    const initialUsers = [
      { name: "Michael Snoredan 🏀", weeklyPoints: 0, totalPoints: 0 },
      { name: "LeBunk James 🏀", weeklyPoints: 0, totalPoints: 0 },
      { name: "Sleephen Curry 🏀", weeklyPoints: 0, totalPoints: 0 },
      { name: "TraviZzz Kelce 🏈", weeklyPoints: 0, totalPoints: 0 },
      { name: "Leon Drowse-aitl 🏒", weeklyPoints: 0, totalPoints: 0 },
      { name: "Katie Bed-decky 🏊‍♀️", weeklyPoints: 0, totalPoints: 0 },
      { name: "Tired Woods ⛳", weeklyPoints: 0, totalPoints: 0 },
      { name: "Cozy Bryant 🏀", weeklyPoints: 0, totalPoints: 0 },
      { name: "Andres Ini-rest-a ⚽", weeklyPoints: 0, totalPoints: 0 },
      { name: "Wayne Restzky 🏒", weeklyPoints: 0, totalPoints: 0 },
      { name: "Snory Mcllroy ⛳", weeklyPoints: 0, totalPoints: 0 },
      { name: "Zinedream Zidane ⚽", weeklyPoints: 0, totalPoints: 0 },
      { name: "Roger Bederer 🎾", weeklyPoints: 0, totalPoints: 0 }, 
      { name: "Snooze-ain Bolt 🏃‍♂️", weeklyPoints: 0, totalPoints: 0 }, 
      { name: "Shohei Oh-yawni ⚾", weeklyPoints: 0, totalPoints: 0 }, 
      { name: "Doze Bichette ⚾", weeklyPoints: 0, totalPoints: 0 }, 
      { name: "Justin Fung 🤓", weeklyPoints: 0, totalPoints: 0}
    ];
    return initialUsers;
  });
  
  // Update fake users and user's leaderboard points on matchday (Saturday)
  const updateFakeUsersOnMatchday = (userWeeklyPoints) => {
    // Update user's leaderboard points with the weekly points from matchday
    const pointsToAdd = userWeeklyPoints !== undefined ? userWeeklyPoints : weeklyPoints;
    setLeaderboardWeeklyPoints(pointsToAdd);
    setLeaderboardTotalPoints((prev) => prev + pointsToAdd);
    
    // Update fake users
    setFakeUsers((prevUsers) => {
      return prevUsers.map((user) => {
        // Justin Fung always gets 0 points
        if (user.name === "Justin Fung 🤓") {
          return { ...user, weeklyPoints: 0 };
        }
        // Other users get random points 0-6
        const randomPoints = Math.floor(Math.random() * 7); // 0 to 6
        return {
          ...user,
          weeklyPoints: randomPoints,
          totalPoints: user.totalPoints + randomPoints,
        };
      });
    });
  }; 

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
      // Use setTimeout to avoid cascading renders warning
      setTimeout(() => {
        setShowSad(true);
      }, 0);
    }
    
    // If streak is regained (goes from 0 to > 0), hide sad character
    // This happens when user clicks "good" after losing streak
    if (showSad && streak > 0) {
      setTimeout(() => {
        setShowSad(false);
      }, 0);
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
              fakeUsers={fakeUsers}
              leaderboardTotalPoints={leaderboardTotalPoints}
              onNavigateToCustomize={() => setCurrentScreen("customize")}
              onMatchdayComplete={updateFakeUsersOnMatchday}
            />
          )}
          {currentScreen === "league" && (
            <LeagueScreen
              username={username}
              weeklyPoints={weeklyPoints}
              totalPoints={totalPoints}
              leaderboardWeeklyPoints={leaderboardWeeklyPoints}
              leaderboardTotalPoints={leaderboardTotalPoints}
              joinedLeagues={joinedLeagues}
              setJoinedLeagues={setJoinedLeagues}
              fakeUsers={fakeUsers}
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
              weeklyPoints={leaderboardWeeklyPoints}
              totalPoints={leaderboardTotalPoints}
              fakeUsers={fakeUsers}
              onBack={() => setCurrentScreen("league")}
            />
          )}
          {currentScreen === "history" && (
            <HistoryScreen streak={streak} sleepHistory={sleepHistory} weeklyPoints={weeklyPoints} totalPoints={totalPoints} />
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
