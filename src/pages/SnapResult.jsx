import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SnapResult() {
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const storedImage = sessionStorage.getItem('greenbites_uploaded_image')
    if (storedImage) {
      setImageUrl(storedImage)
    }
  }, [])

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>
        ← Kembali
      </button>

      <div className="card">
        <div className="brand">GreenBites</div>
        <h1>Analisis Makanan</h1>
        <p>Ini ialah paparan awal selepas gambar diambil.</p>
      </div>

      <div className="card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Makanan yang diambil"
            className="meal-preview"
          />
        ) : (
          <div className="meal-placeholder">Tiada gambar dipilih</div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card danger">
          <div className="stat-title">Kalori</div>
          <div className="stat-value">680 kcal</div>
          <div className="stat-note">Above Target</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-title">Kos</div>
          <div className="stat-value">RM 12</div>
          <div className="stat-note">Within Budget</div>
        </div>

        <div className="stat-card success">
          <div className="stat-title">Impak</div>
          <div className="stat-value">Berat</div>
          <div className="stat-note">Weight Gain Likely</div>
        </div>
      </div>

      <div className="card">
        <h2>Cadangan</h2>
        <ul className="suggestion-list">
          <li>Kurangkan nasi sedikit</li>
          <li>Elakkan air manis</li>
          <li>Tambah sayur jika ada</li>
        </ul>
      </div>

      <button className="snap-button">Log Meal</button>
    </div>
  )
}