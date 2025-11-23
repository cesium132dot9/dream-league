// src/screens/LeagueScreen.jsx
function LeagueScreen({ weeklyPoints, totalPoints, joinedLeagues, setJoinedLeagues, onViewLeaderboard }) {

  // Sample leagues available to join
  const availableLeagues = [
    {
      id: 1,
      name: "Dream Team",
      emoji: "⭐",
      members: 13, 
      description: "Elite sleepers only",
      avgPoints: 6.0
    },
  ];

  const handleJoinLeague = (league) => {
    setJoinedLeagues([...joinedLeagues, league]);
  };

  const handleLeaveLeague = (leagueId) => {
    setJoinedLeagues(joinedLeagues.filter((l) => l.id !== leagueId));
  };

  const isJoined = (leagueId) => {
    return joinedLeagues.some((l) => l.id === leagueId);
  };

  return (
    <div className="h-full p-5 space-y-4 overflow-y-auto pb-20">
      <h1 className="text-xl font-semibold">Leagues</h1>
      <p className="text-sm text-white/70">
        Join leagues to compete with others and climb the leaderboard!
      </p>

      {/* Joined Leagues */}
      {joinedLeagues.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your Leagues</h2>
          {joinedLeagues.map((league) => (
            <div
              key={league.id}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-400/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{league.emoji}</span>
                  <div>
                    <h2 className="text-lg font-bold text-yellow-400">
                      {league.name}
                    </h2>
                    <p className="text-xs text-white/70">Your League</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLeaveLeague(league.id)}
                  className="text-xs bg-rose-500/80 hover:bg-rose-400 px-3 py-1 rounded-lg"
                >
                  Leave
                </button>
              </div>

              <div className="bg-black/30 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Your Rank</span>
                  <span className="font-semibold text-yellow-400">#7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Season Points</span>
                  <span className="font-semibold">{totalPoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Weekly Points</span>
                  <span className="font-semibold">{weeklyPoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Members</span>
                  <span className="font-semibold">{league.members}</span>
                </div>
              </div>

              <button
                onClick={() => onViewLeaderboard(league)}
                className="w-full mt-3 py-2 rounded-xl bg-indigo-500/80 hover:bg-indigo-400 font-semibold text-sm"
              >
                View Leaderboard
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Available Leagues */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          {joinedLeagues.length > 0 ? "Other Leagues" : "Available Leagues"}
        </h2>

        {availableLeagues
          .filter((league) => !isJoined(league.id))
          .map((league) => (
            <div
              key={league.id}
              className="bg-black/30 rounded-2xl p-4 hover:bg-black/40 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-3xl">{league.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{league.name}</h3>
                    <p className="text-xs text-white/60 mt-1">
                      {league.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-white/70">
                      <span>👥 {league.members} members</span>
                      <span>📊 {league.avgPoints} avg pts</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinLeague(league)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-400 font-semibold text-sm whitespace-nowrap"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Info Section */}
      <div className="bg-black/30 rounded-2xl p-4 text-sm space-y-2">
        <p className="font-semibold">How Leagues Work</p>
        <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
          <li>Join leagues to compete with other users</li>
          <li>Your season points determine your rank</li>
          <li>Earn season points every week</li>
          <li>Top 3 players earn special badges</li>
          <li>You can join multiple leagues</li>
        </ul>
      </div>
    </div>
  );
}

export default LeagueScreen;
