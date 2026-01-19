import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Flights from './pages/Flights'
import Experience from './pages/Experience'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="flights" element={<Flights />} />
        <Route path="experience" element={<Experience />} />
      </Route>
    </Routes>
  )
}

export default App
