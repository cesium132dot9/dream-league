// src/screens/CustomizeScreen.jsx
import { useState } from "react";
import whispDefaultImg from "../assets/whisp-default.png";
import whispPitsDefaultImg from "../assets/whisp-pits-default.png";
import whispPitStreakImg from "../assets/whisp-pit-streak.png";
import napsterHappyImg from "../assets/napster-happy.png";
import dozerHappyImg from "../assets/dozer-happy.png";

function CustomizeScreen({ streak, selectedOutfit, setSelectedOutfit, unlockedOutfits = new Set(["default"]) }) {
  const outfits = [
    { 
      id: "default", 
      label: "Whisp", 
      requiredStreak: 0,
      defaultImg: whispDefaultImg,
      streakImg: null, // Uses default streak image
      description: "Default kit.",
      unlockedDescription: "Hoo?"
    },
    { 
      id: "pit", 
      label: "Hack Whisp-stern", 
      requiredStreak: 3,
      defaultImg: whispPitsDefaultImg,
      streakImg: whispPitStreakImg,
      description: "Unlock at 3-day streak.",
      unlockedDescription: "The world is your canvas!"
    },
    { 
      id: "blue", 
      label: "Napster", 
      requiredStreak: 7,
      defaultImg: napsterHappyImg,
      streakImg: null,
      description: "Unlock at 7-day streak.",
      unlockedDescription: "Just purr-fect!"
    },
    { 
      id: "gold", 
      label: "Dozer", 
      requiredStreak: 14,
      defaultImg: dozerHappyImg,
      streakImg: null,
      description: "Unlock at 14-day streak.",
      unlockedDescription: "Zzz..."
    },
  ];

  const [previewOutfit, setPreviewOutfit] = useState(selectedOutfit);

  const handleSelectOutfit = (outfitId) => {
    if (unlockedOutfits.has(outfitId)) {
      setSelectedOutfit(outfitId);
      setPreviewOutfit(outfitId);
    }
  };

  const getCharacterImage = (outfitId, isStreak = false) => {
    const outfit = outfits.find(o => o.id === outfitId);
    if (!outfit) return whispDefaultImg;
    
    if (isStreak && outfit.streakImg) {
      return outfit.streakImg;
    }
    return outfit.defaultImg;
  };

  return (
    <div className="h-full p-5 space-y-4 overflow-y-auto">
      <h1 className="text-xl font-semibold">Customize your player</h1>
      <p className="text-xs text-white/70">
        Outfits unlock as you build longer streaks. Show your form on the pitch
        (and in bed).
      </p>

      {/* Character Preview */}
      <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-center border border-white/10">
        <img
          src={getCharacterImage(previewOutfit, streak >= 2)}
          alt="Whisp"
          className="w-48 h-48 object-contain drop-shadow-xl"
        />
      </div>

      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <p className="text-xs text-white/70">
          Current streak: <span className="font-semibold">{streak} days</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          {outfits.map((outfit) => {
            const unlocked = unlockedOutfits.has(outfit.id);
            const isSelected = selectedOutfit === outfit.id;
            const isPreview = previewOutfit === outfit.id;
            
            return (
              <button
                key={outfit.id}
                onClick={() => handleSelectOutfit(outfit.id)}
                onMouseEnter={() => setPreviewOutfit(outfit.id)}
                onMouseLeave={() => setPreviewOutfit(selectedOutfit)}
                disabled={!unlocked}
                className={`rounded-2xl border px-3 py-3 text-left text-xs space-y-2 transition ${
                  unlocked
                    ? isSelected
                      ? "border-indigo-400 bg-indigo-500/20 hover:bg-indigo-500/30"
                      : "border-indigo-400 bg-white/5 hover:bg-white/10"
                    : "border-white/10 bg-black/40 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={getCharacterImage(outfit.id, false)}
                    alt={outfit.label}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold mb-1">{outfit.label}</p>
                  <p className="text-[11px] text-white/70">
                    {outfit.requiredStreak === 0
                      ? unlocked && outfit.unlockedDescription
                        ? outfit.unlockedDescription
                        : "Default kit."
                      : unlocked
                      ? outfit.unlockedDescription || "Unlocked!"
                      : `Unlock at ${outfit.requiredStreak}-day streak.`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CustomizeScreen;
