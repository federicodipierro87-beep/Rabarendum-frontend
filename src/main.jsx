import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a0000',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#FFD700',
                secondary: '#1a0000',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF0000',
                secondary: '#1a0000',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
