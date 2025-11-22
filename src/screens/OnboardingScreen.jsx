// src/screens/OnboardingScreen.jsx
import { useState } from "react";
import mascotImg from "../assets/mascot.png";

function OnboardingScreen({ onComplete }) {
  const sleepMascots = [
    { emoji: "🦉", label: "Owl", description: "Wise night guardian" },
    { emoji: "🐱", label: "Cat", description: "Cat striker" },
    { emoji: "🐻", label: "Bear", description: "Hibernation master" },
    { emoji: "🦇", label: "Bat", description: "Night flyer" },
    { emoji: "🐨", label: "Koala", description: "Sleep champion" },
    { emoji: "🦝", label: "Raccoon", description: "Night explorer" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedApps, setSelectedApps] = useState(["TikTok", "Instagram", "YouTube", "Twitter/X"]);
  const [bedtime, setBedtime] = useState("23:30");
  const [wakeTime, setWakeTime] = useState("07:30");
  const [selectedMascot, setSelectedMascot] = useState(sleepMascots[0]);

  const totalPages = 4;

  const availableApps = ["TikTok", "Instagram", "YouTube", "Twitter/X", "Reddit", "Snapchat", "Facebook", "Netflix"];

  const toggleApp = (app) => {
    setSelectedApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      // Complete onboarding
      onComplete({
        selectedApps,
        bedtime,
        wakeTime,
        selectedMascot,
      });
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Page 1: Welcome
  const renderWelcomePage = () => (
    <div className="h-full flex flex-col items-center justify-center px-5 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="text-sm text-white/70">
          Treat your sleep like training for the big game. Build streaks, earn
          jerseys, and protect your rest.
        </p>
      </div>
      <div className="relative bg-white/5 rounded-3xl w-full flex items-center justify-center shadow-inner border border-white/10 px-6 py-8">
        <img
          src={mascotImg}
          alt="Mascot"
          className="w-48 h-48 object-contain drop-shadow-xl"
        />
      </div>
      <p className="text-xs text-white/60 text-center">
        Let's set up your sleep routine
      </p>
    </div>
  );

  // Page 2: App blocking
  const renderAppsPage = () => (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-2xl font-bold">Block Temptation Apps</h1>
        <p className="text-sm text-white/70">
          Select apps you want to block during your sleep cycle
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold text-sm">Temptation apps to block</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {availableApps.map((app) => (
            <label
              key={app}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer transition ${
                selectedApps.includes(app)
                  ? "bg-indigo-500/30 border border-indigo-400"
                  : "bg-white/5 border border-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedApps.includes(app)}
                onChange={() => toggleApp(app)}
                className="accent-indigo-400"
              />
              <span>{app}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Page 3: Sleep schedule
  const renderSchedulePage = () => (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-2xl font-bold">Set Your Sleep Schedule</h1>
        <p className="text-sm text-white/70">
          When do you want to sleep and wake up?
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold text-sm">Sleep schedule</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-white/60 mb-1">
              Bedtime
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-white/60 mb-1">
              Wake time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Page 4: Mascot selection
  const renderMascotPage = () => (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-2xl font-bold">Choose Your Mascot</h1>
        <p className="text-sm text-white/70">
          Pick your sleep companion
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold text-sm">Select your mascot</h2>
        <div className="grid grid-cols-2 gap-3">
          {sleepMascots.map((mascot) => (
            <button
              key={mascot.label}
              onClick={() => setSelectedMascot(mascot)}
              className={`rounded-2xl py-4 flex flex-col items-center gap-2 border transition ${
                selectedMascot?.label === mascot.label
                  ? "bg-indigo-500/30 border-indigo-400"
                  : "bg-white/5 border-transparent hover:border-indigo-400/50"
              }`}
            >
              <span className="text-4xl">{mascot.emoji}</span>
              <div className="text-center">
                <span className="text-sm font-semibold block">{mascot.label}</span>
                <span className="text-xs text-white/60">{mascot.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const pages = [
    renderWelcomePage,
    renderAppsPage,
    renderSchedulePage,
    renderMascotPage,
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Page content */}
      <div className="flex-1">{pages[currentPage]()}</div>

      {/* Navigation */}
      <div className="p-5 space-y-3 border-t border-white/10">
        {/* Progress indicator */}
        <div className="flex gap-1 justify-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition ${
                i === currentPage
                  ? "bg-indigo-400 w-8"
                  : i < currentPage
                  ? "bg-indigo-400/50 w-2"
                  : "bg-white/20 w-2"
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentPage > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-semibold text-sm"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-sm shadow-lg shadow-indigo-500/40 ${
              currentPage === 0 ? "w-full" : ""
            }`}
          >
            {currentPage === totalPages - 1 ? "Start training" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingScreen;
