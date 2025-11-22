// src/screens/CustomizeScreen.jsx
import JerseyCard from "../components/JerseyCard";
import MascotCard from "../components/MascotCard";

function CustomizeScreen({ streak }) {
  const jerseys = [
    { id: "basic", label: "Basic Kit", requiredStreak: 0 },
    { id: "blue", label: "Blue Home Kit", requiredStreak: 3 },
    { id: "stripe", label: "Striped Away Kit", requiredStreak: 7 },
    { id: "gold", label: "Golden Captain Kit", requiredStreak: 14 },
  ];

  return (
    <div className="h-full p-5 space-y-4">
      <h1 className="text-xl font-semibold">Customize your player</h1>
      <p className="text-xs text-white/70">
        Jerseys unlock as you build longer streaks. Show your form on the pitch
        (and in bed).
      </p>

      <MascotCard small />

      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <p className="text-xs text-white/70">
          Current streak: <span className="font-semibold">{streak} days</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          {jerseys.map((j) => (
            <JerseyCard
              key={j.id}
              label={j.label}
              requiredStreak={j.requiredStreak}
              unlocked={streak >= j.requiredStreak}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomizeScreen;
