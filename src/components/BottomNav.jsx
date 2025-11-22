// src/components/BottomNav.jsx
function BottomNav({ currentScreen, setCurrentScreen }) {
  const items = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "history", label: "History", icon: "📅" },
    { id: "customize", label: "Customize", icon: "🎽" },
  ];

  return (
    <div className="h-16 bg-black/40 border-t border-white/10 flex items-center justify-around text-xs">
      {items.map((item) => {
        const active = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex flex-col items-center gap-1 ${
              active ? "text-white" : "text-white/60"
            }`}
          >
            <span className={active ? "text-lg" : "text-base"}>
              {item.icon}
            </span>
            <span className={active ? "font-semibold" : ""}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;
