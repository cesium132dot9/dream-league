// src/screens/LeagueLeaderboardScreen.jsx

function LeagueLeaderboardScreen({ league, username, weeklyPoints, totalPoints, fakeUsers, onBack }) {
  // Generate leaderboard with standard competition ranking (tied ranks)
  const generateLeaderboard = () => {
    // Add current user to the list
    const currentUser = {
      name: username,
      weeklyPoints: weeklyPoints,
      totalPoints: totalPoints,
      isCurrentUser: true,
    };

    const allUsers = [...fakeUsers, currentUser];

    // Sort by total points (descending), then by name for consistency
    const sorted = allUsers.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return a.name.localeCompare(b.name);
    });

    // Apply standard competition ranking (tied ranks)
    return sorted.map((user, index) => {
      // Find the rank - if points are equal, use the same rank
      let rank = index + 1;
      if (index > 0 && sorted[index - 1].totalPoints === user.totalPoints) {
        // Find the first user with this score
        for (let i = index - 1; i >= 0; i--) {
          if (sorted[i].totalPoints === user.totalPoints) {
            rank = i + 1;
          } else {
            break;
          }
        }
      }
      return { ...user, rank };
    });
  };

  const leaderboardData = generateLeaderboard();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      <div className="p-5 pb-3">
        <div className="flex items-center mb-4 relative">
          <button
            onClick={onBack}
            className="relative z-10 mr-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer flex-shrink-0"
            type="button"
          >
            <span className="text-xl">←</span>
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center -ml-10 pointer-events-none">
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
            const position = user.rank;
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={index}
                className={`grid grid-cols-[40px_1fr_60px_70px] gap-2 items-center px-3 py-3 rounded-xl transition ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border border-cyan-400/30"
                    : position === 1
                    ? "bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 border border-yellow-300/50"
                    : position === 2
                    ? "bg-gradient-to-r from-slate-300/20 to-gray-400/20 border border-slate-300/40"
                    : position === 3
                    ? "bg-gradient-to-r from-orange-600/20 to-amber-700/20 border border-orange-500/40"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {/* Position */}
                <div className="flex items-center justify-center">
                  {position <= 3 ? (
                    <span className="text-2xl">
                      {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isCurrentUser
                          ? "bg-cyan-400/40 text-cyan-200"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {position}
                    </div>
                  )}
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
