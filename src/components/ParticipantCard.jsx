import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

function ParticipantCard({ participant, currentScore, onVoteUpdate }) {
  const [score, setScore] = useState(currentScore ?? '')
  const [saving, setSaving] = useState(false)
  const [hasVoted, setHasVoted] = useState(currentScore !== undefined)

  useEffect(() => {
    setScore(currentScore ?? '')
    setHasVoted(currentScore !== undefined)
  }, [currentScore])

  const handleScoreChange = (e) => {
    const value = e.target.value
    if (value === '') {
      setScore('')
      return
    }

    const num = parseInt(value)
    if (!isNaN(num) && num >= 0 && num <= 20) {
      setScore(num)
    }
  }

  const handleSubmit = async () => {
    if (score === '' || score === undefined) {
      toast.error('Inserisci un punteggio')
      return
    }

    const numScore = parseInt(score)
    if (numScore < 0 || numScore > 20) {
      toast.error('Il punteggio deve essere tra 0 e 20')
      return
    }

    setSaving(true)
    try {
      await api.post('/votes', {
        participantId: participant.id,
        score: numScore
      })
      setHasVoted(true)
      onVoteUpdate(participant.id, numScore)
      toast.success(`Voto registrato: ${numScore}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Errore nel salvataggio')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className={`
      card flex flex-col sm:flex-row items-center justify-between gap-4
      transition-all duration-300
      ${hasVoted ? 'border-green-500/50 bg-green-900/20' : ''}
    `}>
      <div className="flex items-center gap-3">
        {hasVoted && (
          <span className="text-2xl animate-bounce-slow">✓</span>
        )}
        <h3 className="text-xl font-semibold text-carnival-yellow">
          {participant.name}
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScore(Math.max(0, (parseInt(score) || 0) - 1))}
            className="w-8 h-8 rounded-full bg-carnival-red border border-carnival-yellow/30
                       text-carnival-yellow hover:bg-carnival-red-light
                       flex items-center justify-center font-bold"
            disabled={saving}
          >
            -
          </button>

          <input
            type="number"
            min="0"
            max="20"
            value={score}
            onChange={handleScoreChange}
            onKeyDown={handleKeyDown}
            className="input-score"
            placeholder="0-20"
            disabled={saving}
          />

          <button
            onClick={() => setScore(Math.min(20, (parseInt(score) || 0) + 1))}
            className="w-8 h-8 rounded-full bg-carnival-red border border-carnival-yellow/30
                       text-carnival-yellow hover:bg-carnival-red-light
                       flex items-center justify-center font-bold"
            disabled={saving}
          >
            +
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving || score === ''}
          className={`
            btn text-sm py-2 px-4
            ${hasVoted
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'btn-primary'
            }
          `}
        >
          {saving ? '...' : hasVoted ? 'Aggiorna' : 'Vota'}
        </button>
      </div>
    </div>
  )
}

export default ParticipantCard
