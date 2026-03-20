import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleOpenCamera = () => {
    fileInputRef.current?.click()
  }

  const handleSnap = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    sessionStorage.setItem('greenbites_uploaded_image', imageUrl)
    sessionStorage.setItem('greenbites_uploaded_image_name', file.name)

    navigate('/scanning')
  }

  return (
    <div className="page">
      <div className="card">
        <div className="brand">GreenBites</div>
        <h1>Dashboard Harian</h1>
        <p>Pantau kalori, bajet makanan dan berat badan dalam satu skrin.</p>
      </div>

      <div className="card">
        <h3>Kalori hari ini</h3>
        <div className="value">1180 / 1800 kcal</div>
      </div>

      <div className="card">
        <h3>Bajet hari ini</h3>
        <div className="value">RM 22 / RM 30</div>
      </div>

      <div className="card">
        <h3>Berat semasa</h3>
        <div className="value">78.4 kg</div>
      </div>

      <div className="card">
        <h2>Fokus malam ini</h2>
        <p>
          Cuba aliran paling ringkas: tekan butang di bawah, ambil gambar makanan,
          dan lihat paparan cadangan sebelum makan.
        </p>
      </div>

      <button className="snap-button" onClick={handleOpenCamera}>
        📸 Snap Meal
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleSnap}
        style={{ display: 'none' }}
      />
    </div>
  )
}