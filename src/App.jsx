// src/App.jsx
import { useState } from "react";
import OnboardingScreen from "./screens/OnboardingScreen";
import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import CustomizeScreen from "./screens/CustomizeScreen";
import BottomNav from "./components/BottomNav";

function App() {
  const [currentScreen, setCurrentScreen] = useState("onboarding");
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // demo state – later you can wire this up properly
  const [streak, setStreak] = useState(0);
  const [freezes, setFreeze] = useState(2);
  const [targetBedtime, setTargetBedtime] = useState("23:00");
  const [sleepHistory, setSleepHistory] = useState([]); // Array of {date, status: 'good'|'late'|'freeze'}
  const [weeklyPoints, setWeeklyPoints] = useState(0); 

  const handleCompleteOnboarding = (onboardingData) => {
    // Store onboarding data (you can use this later for app blocking, schedule, etc.)
    console.log("Onboarding complete:", onboardingData);
    setTargetBedtime(onboardingData.bedtime);
    setHasOnboarded(true);
    setCurrentScreen("home");
  };

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
            />
          )}
          {currentScreen === "history" && (
            <HistoryScreen streak={streak} sleepHistory={sleepHistory} weeklyPoints={weeklyPoints} />
          )}
          {currentScreen === "customize" && (
            <CustomizeScreen streak={streak} />
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
