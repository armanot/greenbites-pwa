import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SnapResult from './pages/SnapResult.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snap-result" element={<SnapResult />} />
      </Routes>
    </BrowserRouter>
  )
}