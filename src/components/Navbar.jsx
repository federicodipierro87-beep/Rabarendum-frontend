import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-carnival-red-dark/80 backdrop-blur-sm border-b border-carnival-yellow/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🎭</span>
              <span className="font-display text-2xl text-carnival-yellow glow hidden sm:block">
                Carnival Voting
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={isActive('/') ? 'tab-active' : 'tab-inactive'}
              >
                Vota
              </Link>
              <Link
                to="/results"
                className={isActive('/results') ? 'tab-active' : 'tab-inactive'}
              >
                Risultati
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={isActive('/admin') ? 'tab-active' : 'tab-inactive'}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-carnival-yellow font-medium">{user?.name}</p>
              <p className="text-carnival-yellow/60 text-sm">
                {isAdmin ? 'Amministratore' : 'Giuria'}
              </p>
            </div>
            <button
              onClick={logout}
              className="btn-secondary text-sm py-2 px-4"
            >
              Esci
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
