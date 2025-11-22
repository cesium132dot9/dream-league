// src/screens/OnboardingScreen.jsx
function OnboardingScreen({ onComplete }) {
  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <h1 className="text-2xl font-bold">Welcome to Sleep Squad ⚽😴</h1>
      <p className="text-sm text-white/70">
        Treat your sleep like training for the big game. Build streaks, earn
        jerseys, and protect your rest.
      </p>

      {/* Sleep schedule card */}
      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold text-sm">Sleep schedule</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-white/60 mb-1">
              Bedtime
            </label>
            <input
              type="time"
              defaultValue="23:30"
              className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-white/60 mb-1">
              Wake time
            </label>
            <input
              type="time"
              defaultValue="07:30"
              className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Apps card */}
      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold text-sm">Temptation apps to block</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["TikTok", "Instagram", "YouTube", "Twitter/X"].map((app) => (
            <label
              key={app}
              className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2"
            >
              <input
                type="checkbox"
                defaultChecked
                className="accent-indigo-400"
              />
              <span>{app}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mascot card */}
      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold text-sm">Choose your mascot</h2>
        <div className="flex gap-3">
          {[
            { emoji: "🐱", label: "Cat striker" },
            { emoji: "🐶", label: "Dog keeper" },
            { emoji: "🦊", label: "Fox winger" },
          ].map((m) => (
            <button
              key={m.label}
              className="flex-1 bg-white/5 rounded-2xl py-3 flex flex-col items-center gap-1 border border-transparent hover:border-indigo-400 transition"
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs text-white/80 text-center">
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-sm shadow-lg shadow-indigo-500/40"
      >
        Start training
      </button>
    </div>
  );
}

export default OnboardingScreen;
