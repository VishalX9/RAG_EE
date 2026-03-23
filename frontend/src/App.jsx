import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './LandingPage'
import AuthPage from './AuthPage'
import ChatApp from './ChatApp' // Assuming your main chat UI is saved here

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/chat" element={<ChatApp />} />
      
      {/* Fallback route - if they type a wrong URL, send them home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}