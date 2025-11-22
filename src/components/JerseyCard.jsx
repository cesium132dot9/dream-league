// src/components/JerseyCard.jsx
function JerseyCard({ label, requiredStreak, unlocked }) {
  return (
    <button
      disabled={!unlocked}
      className={`rounded-2xl border px-3 py-3 text-left text-xs space-y-2 ${
        unlocked
          ? "border-indigo-400 bg-white/5 hover:bg-white/10"
          : "border-white/10 bg-black/40 opacity-60"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">👕</span>
        <span className="font-semibold">{label}</span>
      </div>
      <p className="text-[11px] text-white/70">
        {requiredStreak === 0
          ? "Default kit."
          : unlocked
          ? "Unlocked!"
          : `Unlock at ${requiredStreak}-day streak.`}
      </p>
    </button>
  );
}

export default JerseyCard;
