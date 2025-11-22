// src/components/MascotCard.jsx
function MascotCard({ streak, small = false }) {
  const sizeClasses = small ? "text-4xl" : "text-6xl";
  const moodEmoji = streak >= 7 ? "💪" : streak >= 3 ? "🙂" : "🥱";

  return (
    <div className="bg-black/30 rounded-2xl p-4 flex items-center gap-4">
      <div className={`${sizeClasses}`}>🐱</div>
      <div className="flex-1">
        <p className="text-sm font-semibold">Captain Whiskers</p>
        <p className="text-xs text-white/70">
          {streak === 0
            ? "Tired from late‑night scrolling…"
            : `On a ${streak}-day streak, feeling ${streak >= 7 ? "unstoppable" : "better"}!`}
        </p>
      </div>
      <div className="text-2xl">{moodEmoji}</div>
    </div>
  );
}

export default MascotCard;
