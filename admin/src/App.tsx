import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import News from './pages/News'
import Events from './pages/Events'
import Services from './pages/Services'
import Team from './pages/Team'
import Pages from './pages/Pages'
import Messages from './pages/Messages'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="news" element={<News />} />
            <Route path="events" element={<Events />} />
            <Route path="services" element={<Services />} />
            <Route path="team" element={<Team />} />
            <Route path="pages" element={<Pages />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
