import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser, logout, type AuthUser } from './auth'
import LoginPage from './pages/LoginPage'
import ProfessorPage from './pages/ProfessorPage'
import VoterPage from './pages/VoterPage'
import StudentLandingPage from './pages/StudentLandingPage'

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(getUser)

  function handleLogout() {
    logout()
    setUser(null)
  }

  if (!user) return <LoginPage onLogin={setUser} />

  return (
    <BrowserRouter>
      <Routes>
        {user.role === 'professor' ? (
          <>
            <Route path="/" element={<ProfessorPage onLogout={handleLogout} />} />
            <Route path="/poll/:id" element={<VoterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<StudentLandingPage onLogout={handleLogout} />} />
            <Route path="/poll/:id" element={<VoterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}
