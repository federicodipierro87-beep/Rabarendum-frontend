function Leaderboard({ results, category, showVoteCount = false }) {
  const categoryResults = results[category] || []

  const getMedal = (index) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return null
    }
  }

  const getPositionStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-600/30 to-yellow-500/20 border-yellow-500/50'
      case 1:
        return 'bg-gradient-to-r from-gray-400/30 to-gray-300/20 border-gray-400/50'
      case 2:
        return 'bg-gradient-to-r from-amber-700/30 to-amber-600/20 border-amber-600/50'
      default:
        return 'bg-carnival-red/30 border-carnival-yellow/10'
    }
  }

  if (categoryResults.length === 0) {
    return (
      <div className="text-center py-8 text-carnival-yellow/60">
        Nessun partecipante in questa categoria
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {categoryResults.map((item, index) => (
        <div
          key={item.id}
          className={`
            flex items-center justify-between p-4 rounded-xl border
            transition-all duration-300 hover:scale-[1.02]
            ${getPositionStyle(index)}
          `}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 text-center">
              {getMedal(index) ? (
                <span className="text-2xl">{getMedal(index)}</span>
              ) : (
                <span className="text-lg font-bold text-carnival-yellow/60">
                  {index + 1}
                </span>
              )}
            </div>
            <span className="text-lg font-medium text-carnival-yellow">
              {item.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {showVoteCount && (
              <span className="text-sm text-carnival-yellow/60">
                {item.voteCount} {item.voteCount === 1 ? 'voto' : 'voti'}
              </span>
            )}
            <div className="bg-carnival-yellow/10 px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold text-carnival-yellow">
                {item.average.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Leaderboard
