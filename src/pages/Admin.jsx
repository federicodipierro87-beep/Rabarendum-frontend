import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { CATEGORIES } from '../components/CategoryTabs'
import LoadingSpinner from '../components/LoadingSpinner'

function Admin() {
  const [activeTab, setActiveTab] = useState('participants')
  const [participants, setParticipants] = useState({})
  const [users, setUsers] = useState([])
  const [progress, setProgress] = useState([])
  const [totalParticipants, setTotalParticipants] = useState(0)
  const [loading, setLoading] = useState(true)

  // Form states
  const [newParticipant, setNewParticipant] = useState({ name: '', category: 'CARRI' })
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [participantsRes, usersRes, progressRes] = await Promise.all([
        api.get('/participants'),
        api.get('/users'),
        api.get('/results/progress')
      ])

      setParticipants(participantsRes.data.participants)
      setUsers(usersRes.data.users)
      setProgress(progressRes.data.progress)
      setTotalParticipants(progressRes.data.totalParticipants)
    } catch (error) {
      toast.error('Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  // Participant handlers
  const handleAddParticipant = async (e) => {
    e.preventDefault()
    if (!newParticipant.name.trim()) {
      toast.error('Inserisci il nome del partecipante')
      return
    }

    setSaving(true)
    try {
      await api.post('/participants', newParticipant)
      toast.success('Partecipante aggiunto')
      setNewParticipant({ name: '', category: 'CARRI' })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Errore')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteParticipant = async (id, name) => {
    if (!confirm(`Eliminare "${name}"? Tutti i voti associati saranno cancellati.`)) {
      return
    }

    try {
      await api.delete(`/participants/${id}`)
      toast.success('Partecipante eliminato')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Errore')
    }
  }

  // User handlers
  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast.error('Compila tutti i campi')
      return
    }

    setSaving(true)
    try {
      await api.post('/users', newUser)
      toast.success('Giurato aggiunto')
      setNewUser({ username: '', password: '', name: '' })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Errore')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Eliminare "${name}"? Tutti i voti associati saranno cancellati.`)) {
      return
    }

    try {
      await api.delete(`/users/${id}`)
      toast.success('Giurato eliminato')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Errore')
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-carnival-yellow glow mb-2">
          Pannello Admin
        </h1>
        <p className="text-carnival-yellow/60">
          Gestisci partecipanti, giurati e monitora il progresso
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center">
        {[
          { id: 'participants', label: 'Partecipanti', icon: '🎭' },
          { id: 'users', label: 'Giurati', icon: '👥' },
          { id: 'progress', label: 'Progresso', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-carnival-yellow text-carnival-red-dark'
                : 'bg-carnival-red/50 text-carnival-yellow/80 hover:bg-carnival-red border border-carnival-yellow/20'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div>
          {/* Add form */}
          <form onSubmit={handleAddParticipant} className="card mb-8">
            <h3 className="text-lg font-semibold text-carnival-yellow mb-4">
              Aggiungi Partecipante
            </h3>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant(p => ({ ...p, name: e.target.value }))}
                placeholder="Nome partecipante"
                className="input flex-1 min-w-[200px]"
                disabled={saving}
              />
              <select
                value={newParticipant.category}
                onChange={(e) => setNewParticipant(p => ({ ...p, category: e.target.value }))}
                className="input w-40"
                disabled={saving}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? '...' : 'Aggiungi'}
              </button>
            </div>
          </form>

          {/* Participants list */}
          <div className="grid md:grid-cols-2 gap-6">
            {CATEGORIES.map((category) => (
              <div key={category.id} className="card">
                <h3 className="text-lg font-semibold text-carnival-yellow mb-4 flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  <span className="text-carnival-yellow/60 text-sm ml-auto">
                    ({(participants[category.id] || []).length})
                  </span>
                </h3>
                {(participants[category.id] || []).length === 0 ? (
                  <p className="text-carnival-yellow/40 text-sm">Nessun partecipante</p>
                ) : (
                  <ul className="space-y-2">
                    {(participants[category.id] || []).map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between p-2 bg-carnival-red/30 rounded-lg"
                      >
                        <span className="text-carnival-yellow">{p.name}</span>
                        <button
                          onClick={() => handleDeleteParticipant(p.id, p.name)}
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Add form */}
          <form onSubmit={handleAddUser} className="card mb-8">
            <h3 className="text-lg font-semibold text-carnival-yellow mb-4">
              Aggiungi Giurato
            </h3>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser(u => ({ ...u, name: e.target.value }))}
                placeholder="Nome completo"
                className="input flex-1 min-w-[150px]"
                disabled={saving}
              />
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser(u => ({ ...u, username: e.target.value }))}
                placeholder="Username"
                className="input w-36"
                disabled={saving}
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser(u => ({ ...u, password: e.target.value }))}
                placeholder="Password"
                className="input w-36"
                disabled={saving}
              />
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? '...' : 'Aggiungi'}
              </button>
            </div>
          </form>

          {/* Users list */}
          <div className="card">
            <h3 className="text-lg font-semibold text-carnival-yellow mb-4">
              Giurati ({users.length})
            </h3>
            {users.length === 0 ? (
              <p className="text-carnival-yellow/40">Nessun giurato registrato</p>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-carnival-red/30 rounded-lg"
                  >
                    <div>
                      <p className="text-carnival-yellow font-medium">{user.name}</p>
                      <p className="text-carnival-yellow/60 text-sm">@{user.username}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-carnival-yellow/60 text-sm">
                        {user._count.votes} voti
                      </span>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-red-400 hover:text-red-300 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-carnival-yellow mb-6">
            Progresso Votazione
          </h3>

          {progress.length === 0 ? (
            <p className="text-carnival-yellow/40">Nessun giurato registrato</p>
          ) : (
            <div className="space-y-4">
              {progress.map((juror) => (
                <div key={juror.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-carnival-yellow font-medium">{juror.name}</span>
                      <span className="text-carnival-yellow/60 text-sm ml-2">
                        @{juror.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-carnival-yellow/60 text-sm">
                        {juror.votesCount}/{totalParticipants}
                      </span>
                      {juror.completed && (
                        <span className="text-green-400">✓</span>
                      )}
                    </div>
                  </div>
                  <div className="h-3 bg-carnival-red rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        juror.completed
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : 'bg-gradient-to-r from-carnival-yellow to-carnival-yellow-light'
                      }`}
                      style={{ width: `${juror.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-carnival-yellow/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-carnival-yellow">
                  {progress.length}
                </p>
                <p className="text-carnival-yellow/60 text-sm">Giurati</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400">
                  {progress.filter(j => j.completed).length}
                </p>
                <p className="text-carnival-yellow/60 text-sm">Completati</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-carnival-yellow">
                  {progress.length > 0
                    ? Math.round(progress.filter(j => j.completed).length / progress.length * 100)
                    : 0}%
                </p>
                <p className="text-carnival-yellow/60 text-sm">Progresso</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
