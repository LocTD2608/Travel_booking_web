import { Routes, Route } from 'react-router-dom'
import MainLayout from "./components/layout/MainLayout"
import { HomePage } from './pages/Home/HomePage'
import Flights from './pages/Transport/Flights'
import Experience from './pages/Experience/Experience'
import Contact from './pages/Contact/Contact'
import AboutUs from './pages/AboutUs/AboutUs'
import Trains from './pages/Transport/Trains'
import Hotels from './pages/Accommodations/Hotels'
import Apartments from './pages/Accommodations/Apartments'
import HowToBook from './pages/HowToBook/HowToBook'
import HelpCenter from './pages/HelpCenter/HelpCenter'
import Careers from './pages/Careers/Careers'
import ScrollToTop from './components/common/ScrollToTop'
import Login from "./pages/Login"

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* Route không dùng layout */}
        <Route path="/login" element={<Login />} />

        {/* Route dùng MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/trains" element={<Trains />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/how-to-book" element={<HowToBook />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/careers" element={<Careers />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
