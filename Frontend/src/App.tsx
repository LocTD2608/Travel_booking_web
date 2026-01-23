import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import Flights from './pages/Flights'
import Experience from './pages/Experience'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/experience" element={<Experience />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

