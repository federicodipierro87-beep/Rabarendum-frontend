import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const fireConfetti = () => {
    const colors = ['#FFD700', '#CC0000', '#FF0000', '#FFC200']

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors
    })

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      })
    }, 200)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error('Inserisci username e password')
      return
    }

    setLoading(true)
    try {
      const user = await login(username, password)
      fireConfetti()
      toast.success(`Benvenuto, ${user.name}!`)
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Credenziali non valide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🎭</div>
          <h1 className="font-display text-5xl text-carnival-yellow glow mb-2">
            Carnival Voting
          </h1>
          <p className="text-carnival-yellow/60">
            Sistema di votazione giuria
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-carnival-yellow mb-2 font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Inserisci username"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-carnival-yellow mb-2 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Inserisci password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span>Accesso in corso...</span>
              </>
            ) : (
              <>
                <span>Accedi</span>
                <span>🎪</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-carnival-yellow/40 text-sm">
          Contatta l'amministratore per le credenziali
        </p>
      </div>
    </div>
  )
}

export default Login
