import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import CategoryTabs, { CATEGORIES } from '../components/CategoryTabs'
import Leaderboard from '../components/Leaderboard'
import LoadingSpinner from '../components/LoadingSpinner'

function Results() {
  const [results, setResults] = useState({})
  const [stats, setStats] = useState(null)
  const [activeCategory, setActiveCategory] = useState('CARRI')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchResults()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchResults, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchResults = async () => {
    try {
      const res = await api.get('/results')
      setResults(res.data.results)
      setStats(res.data.stats)
      setLastUpdated(new Date())
    } catch (error) {
      toast.error('Errore nel caricamento dei risultati')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-carnival-yellow glow mb-2">
          Classifica
        </h1>
        <p className="text-carnival-yellow/60">
          Punteggi medi per categoria
        </p>
        {lastUpdated && (
          <p className="text-carnival-yellow/40 text-sm mt-2">
            Ultimo aggiornamento: {lastUpdated.toLocaleTimeString()}
            <button
              onClick={fetchResults}
              className="ml-2 hover:text-carnival-yellow transition-colors"
            >
              🔄
            </button>
          </p>
        )}
      </div>

      {/* Admin stats */}
      {isAdmin && stats && (
        <div className="card mb-8 bg-carnival-purple/20 border-carnival-purple/30">
          <h3 className="text-lg font-semibold text-carnival-yellow mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Statistiche Votazione</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-carnival-yellow">
                {stats.totalJurors}
              </p>
              <p className="text-carnival-yellow/60 text-sm">Giurati</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-carnival-yellow">
                {stats.totalParticipants}
              </p>
              <p className="text-carnival-yellow/60 text-sm">Partecipanti</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">
                {stats.jurorsCompleted}
              </p>
              <p className="text-carnival-yellow/60 text-sm">Completati</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-carnival-yellow">
                {stats.totalJurors > 0
                  ? Math.round((stats.jurorsCompleted / stats.totalJurors) * 100)
                  : 0}%
              </p>
              <p className="text-carnival-yellow/60 text-sm">Progresso</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-carnival-yellow flex items-center gap-2">
          <span>{CATEGORIES.find(c => c.id === activeCategory)?.icon}</span>
          <span>{CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
        </h2>
      </div>

      <Leaderboard
        results={results}
        category={activeCategory}
        showVoteCount={isAdmin}
      />

      {/* All categories overview */}
      <div className="mt-12">
        <h2 className="font-display text-2xl text-carnival-yellow glow mb-6 text-center">
          Vincitori per Categoria
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {CATEGORIES.map((category) => {
            const winner = results[category.id]?.[0]
            return (
              <div
                key={category.id}
                className="card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <p className="text-carnival-yellow/60 text-sm">
                      {category.label}
                    </p>
                    <p className="text-carnival-yellow font-semibold">
                      {winner ? winner.name : 'Nessun voto'}
                    </p>
                  </div>
                </div>
                {winner && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥇</span>
                    <span className="text-xl font-bold text-carnival-yellow">
                      {winner.average.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Results
