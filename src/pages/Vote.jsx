import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import CategoryTabs, { CATEGORIES } from '../components/CategoryTabs'
import ParticipantCard from '../components/ParticipantCard'
import LoadingSpinner from '../components/LoadingSpinner'

function Vote() {
  const [participants, setParticipants] = useState({})
  const [votesMap, setVotesMap] = useState({})
  const [activeCategory, setActiveCategory] = useState('CARRI')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [participantsRes, votesRes] = await Promise.all([
        api.get('/participants'),
        api.get('/votes/my')
      ])

      setParticipants(participantsRes.data.participants)
      setVotesMap(votesRes.data.votesMap)
    } catch (error) {
      toast.error('Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const handleVoteUpdate = (participantId, score) => {
    setVotesMap(prev => ({
      ...prev,
      [participantId]: score
    }))
  }

  const currentParticipants = participants[activeCategory] || []

  // Calculate voting progress
  const totalParticipants = Object.values(participants).flat().length
  const votedCount = Object.keys(votesMap).length
  const progressPercent = totalParticipants > 0
    ? Math.round((votedCount / totalParticipants) * 100)
    : 0

  // Category progress
  const categoryVoted = currentParticipants.filter(p => votesMap[p.id] !== undefined).length
  const categoryTotal = currentParticipants.length

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
          Vota i Partecipanti
        </h1>
        <p className="text-carnival-yellow/60 mb-4">
          Assegna un punteggio da 0 a 20
        </p>

        {/* Progress bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-carnival-yellow/60 mb-1">
            <span>Progresso totale</span>
            <span>{votedCount}/{totalParticipants} ({progressPercent}%)</span>
          </div>
          <div className="h-2 bg-carnival-red rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-carnival-yellow to-carnival-yellow-light transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Category progress */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-carnival-yellow flex items-center gap-2">
          <span>{CATEGORIES.find(c => c.id === activeCategory)?.icon}</span>
          <span>{CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
        </h2>
        <span className="text-carnival-yellow/60 text-sm">
          {categoryVoted}/{categoryTotal} votati
        </span>
      </div>

      {currentParticipants.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-carnival-yellow/60 text-lg">
            Nessun partecipante in questa categoria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              currentScore={votesMap[participant.id]}
              onVoteUpdate={handleVoteUpdate}
            />
          ))}
        </div>
      )}

      {progressPercent === 100 && (
        <div className="mt-8 card text-center bg-green-900/30 border-green-500/50">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-semibold text-green-400 mb-2">
            Votazione completata!
          </h3>
          <p className="text-green-400/70">
            Hai votato tutti i partecipanti. Puoi ancora modificare i tuoi voti.
          </p>
        </div>
      )}
    </div>
  )
}

export default Vote
