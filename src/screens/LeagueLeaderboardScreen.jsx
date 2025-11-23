// src/screens/LeagueLeaderboardScreen.jsx

function LeagueLeaderboardScreen({ league, username, weeklyPoints, totalPoints, onBack }) {
  // Generate fake leaderboard data for demo
  const generateLeaderboard = () => {
    const fakeUsers = [
      { name: "Lionel Meowssi", weeklyPoints: 8, totalPoints: 45 },
      { name: "Slotan Ibrahimovic", weeklyPoints: 6, totalPoints: 42 },
      { name: "Catstiano Ronaldo", weeklyPoints: 10, totalPoints: 38 },
      { name: "Thierry Hungry", weeklyPoints: 7, totalPoints: 35 },
      { name: "Zinedine Zleep", weeklyPoints: 5, totalPoints: 33 },
      { name: "Luka Modrobinć", weeklyPoints: 9, totalPoints: 31 },
      { name: "Ninja Turtle", weeklyPoints: 4, totalPoints: 28 },
      { name: "Justin Fung", weeklyPoints: 0, totalPoints: 0 },
      { name: "Ronaldingo", weeklyPoints: 6, totalPoints: 24 },
      { name: "Neymaraptor", weeklyPoints: 8, totalPoints: 22 },
      { name: "Wayne Roo-kney", weeklyPoints: 5, totalPoints: 20 },
      { name: "Kevin De Br-owl-ne", weeklyPoints: 3, totalPoints: 18 },
    ];

    // Add current user to the list
    const currentUser = {
      name: username,
      weeklyPoints: weeklyPoints,
      totalPoints: totalPoints,
      isCurrentUser: true,
    };

    const allUsers = [...fakeUsers, currentUser];

    // Sort by total points (descending)
    return allUsers.sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const leaderboardData = generateLeaderboard();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      <div className="p-5 pb-3">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="mr-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <span className="text-xl">←</span>
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center -ml-10">
            {league.emoji} {league.name}
          </h1>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="flex-1 overflow-y-auto px-5 pb-20">
        <div className="space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_60px_70px] gap-2 px-3 py-2 text-xs text-white/60 font-medium">
            <div>Pos</div>
            <div>Player</div>
            <div className="text-right">Points</div>
            <div className="text-right">Total</div>
          </div>

          {/* Leaderboard Rows */}
          {leaderboardData.map((user, index) => {
            const position = index + 1;
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={index}
                className={`grid grid-cols-[40px_1fr_60px_70px] gap-2 items-center px-3 py-3 rounded-xl transition ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border border-cyan-400/30"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {/* Position */}
                <div className="flex items-center justify-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isCurrentUser
                        ? "bg-cyan-400/40 text-cyan-200"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {position}
                  </div>
                </div>

                {/* Player Name */}
                <div>
                  <p className={`text-sm font-semibold ${isCurrentUser ? "text-cyan-100" : "text-white"}`}>
                    {user.name}
                  </p>
                </div>

                {/* Weekly Points */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {user.weeklyPoints}
                  </p>
                </div>

                {/* Total Points */}
                <div className="text-right">
                  <p className={`text-base font-bold ${
                    isCurrentUser ? "text-yellow-400" : "text-white"
                  }`}>
                    {user.totalPoints}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LeagueLeaderboardScreen;
