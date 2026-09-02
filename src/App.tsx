import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import News from './pages/News'
import OurTeam from './pages/OurTeam'
import Services from './pages/Services'
import Contact from './pages/Contact'
import ContentPage from './pages/ContentPage'
import NotFound from './pages/NotFound'
import { othersLinks, aboutLinks } from './navLinks'

const contentRoutes = [...othersLinks, ...aboutLinks]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="news" element={<News />} />
          <Route path="our-team" element={<OurTeam />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          {contentRoutes.map((link) => (
            <Route
              key={link.to}
              path={link.to.slice(1)}
              element={<ContentPage slug={link.to} fallbackTitle={link.label} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
