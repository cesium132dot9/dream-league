// src/screens/OnboardingScreen.jsx
import { useState } from "react";
import mascotImg from "../assets/mascot.png";
import mascotHappyImg from "../assets/mascot-happy.png";
import dreamLeagueIcon from "../assets/DreamLeague-icon.png";

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

  // Page 1: Welcome (Duolingo style)
  const renderWelcomePage = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      {/* Mascot at top */}
      <div className="flex-1 flex items-center justify-center pt-12 pb-4">
        <img
          src={mascotHappyImg}
          alt="Mascot"
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Logo and tagline - directly below mascot like Duolingo */}
      <div className="flex flex-col items-center px-8 pb-8">
        <img
          src={dreamLeagueIcon}
          alt="Dream League"
          className="h-14 object-contain mb-3"
        />
        <p className="text-sm text-white/70 text-center">
          Beat the scroll. Keep the streak
        </p>
      </div>

      {/* Buttons */}
      <div className="px-5 pb-8 space-y-3">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-semibold text-sm text-white uppercase tracking-wide shadow-lg shadow-indigo-500/40 transition"
        >
          Get Started
        </button>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-white/10 border-2 border-white/20 hover:border-white/30 hover:bg-white/20 font-semibold text-sm text-white uppercase tracking-wide transition"
        >
          I Already Have An Account
        </button>
      </div>
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

      {/* Navigation - hidden on welcome page */}
      {currentPage > 0 && (
        <div className="p-5 space-y-3 border-t border-white/10 bg-gradient-to-b from-indigo-900 to-slate-900">
          {/* Progress indicator */}
          <div className="flex gap-1 justify-center">
            {Array.from({ length: totalPages - 1 }).map((_, i) => {
              const pageIndex = i + 1; // Skip welcome page in indicator
              return (
                <div
                  key={pageIndex}
                  className={`h-1 rounded-full transition ${
                    pageIndex === currentPage
                      ? "bg-indigo-400 w-8"
                      : pageIndex < currentPage
                      ? "bg-indigo-400/50 w-2"
                      : "bg-white/20 w-2"
                  }`}
                />
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-sm text-white shadow-lg shadow-indigo-500/40"
            >
              {currentPage === totalPages - 1 ? "Start training" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnboardingScreen;
