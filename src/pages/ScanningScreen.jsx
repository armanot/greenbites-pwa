import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ScanningScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/snap-result')
    }, 1500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="page centered-page">
      <div className="card scanning-card">
        <div className="brand">GreenBites</div>
        <div className="scanner-icon">📸</div>
        <h1>Scanning your meal...</h1>
        <p>Kami sedang menganggar kalori, kos, dan cadangan lebih sihat.</p>

        <div className="spinner"></div>

        <div className="scan-steps">
          <div>✔ Gambar diterima</div>
          <div>⏳ Mengenal pasti makanan</div>
          <div>⏳ Menjana cadangan</div>
        </div>
      </div>
    </div>
  )
}