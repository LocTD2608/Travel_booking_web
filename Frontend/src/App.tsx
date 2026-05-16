import { Routes, Route } from 'react-router-dom'
import MainLayout from "./components/layout/MainLayout"
import { HomePage } from './pages/Home/HomePage'
import Flights from './pages/Transport/Flights'
import Experience from './pages/Experience/Experience'
import Contact from './pages/Contact/Contact'
import AboutUs from './pages/AboutUs/AboutUs'
import Trains from './pages/Transport/Trains'
import Hotels from './pages/Accommodations/Hotels'
import HotelDetail from './pages/Accommodations/HotelDetail'
import Apartments from './pages/Accommodations/Apartments'
import HowToBook from './pages/HowToBook/HowToBook'
import HelpCenter from './pages/HelpCenter/HelpCenter'
import Careers from './pages/Careers/Careers'
import ScrollToTop from './components/common/ScrollToTop'
import Login from "./pages/Login"
import BookingPage from "./pages/BookingPage"
import SearchResults from './pages/SearchResults/SearchResults'
import ResetPassword from './pages/ResetPassword'

import Villas from './pages/Accommodations/Villas'
import VillaDetail from './pages/Accommodations/VillaDetail'
import ApartmentDetail from './pages/Accommodations/ApartmentDetail'
import BusShuttle from './pages/Transport/BusShuttle'
import AirportTransfer from './pages/Transport/AirportTransfer'
import CarRental from './pages/Transport/CarRental'
import MobileCredit from './pages/Bills/MobileCredit'
import DataPlans from './pages/Bills/DataPlans'
import Electricity from './pages/Bills/Electricity'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminRoute from './components/common/AdminRoute'

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* Routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin route - protected */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Route dùng MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/trains" element={<Trains />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/apartments/:id" element={<ApartmentDetail />} />
          <Route path="/villas" element={<Villas />} />
          <Route path="/villas/:id" element={<VillaDetail />} />
          <Route path="/how-to-book" element={<HowToBook />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/search" element={<SearchResults />} />

          <Route path="/bus" element={<BusShuttle />} />
          <Route path="/airport-transfer" element={<AirportTransfer />} />
          <Route path="/car-rental" element={<CarRental />} />
          <Route path="/mobile-credit" element={<MobileCredit />} />
          <Route path="/data-plans" element={<DataPlans />} />
          <Route path="/electricity" element={<Electricity />} />
        </Route>

      </Routes>
    </>
  )
}

export default App

