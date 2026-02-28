import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header/Header'
import { Footer } from './components/layout/Footer/Footer'
import { HomePage } from './pages/Home/HomePage'
import Flights from './pages/Flights'
import Experience from './pages/Experience'
import Contact from './pages/Contact/Contact'
import AboutUs from './pages/AboutUs/AboutUs'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

