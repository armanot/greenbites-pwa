import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const navigate = useNavigate()

  const handleOpenCamera = () => {
    cameraInputRef.current?.click()
  }

  const handleOpenGallery = () => {
    galleryInputRef.current?.click()
  }

  const handleImageSelected = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  const imageUrl = URL.createObjectURL(file)

  sessionStorage.setItem('greenbites_uploaded_image', imageUrl)
  sessionStorage.setItem('greenbites_uploaded_image_name', file.name)

  // simpan maklumat file untuk flow seterusnya
  window.greenbitesSelectedFile = file

  navigate('/scanning')
}

  return (
    <div className="page">
      <div className="card hero-card">
        <div className="brand">GreenBites</div>
        <h1>Dashboard Harian</h1>
        <p className="hero-text">
          Pantau kalori, bajet makanan dan berat badan dalam satu skrin.
        </p>
      </div>

      <div className="card">
        <h3>Kalori hari ini</h3>
        <div className="value">1180 / 1800 kcal</div>
        <div className="progress-track">
          <div className="progress-fill green-fill" style={{ width: '66%' }} />
        </div>
      </div>

      <div className="card">
        <h3>Bajet hari ini</h3>
        <div className="value">RM 22 / RM 30</div>
        <div className="progress-track">
          <div className="progress-fill orange-fill" style={{ width: '73%' }} />
        </div>
      </div>

      <div className="card">
        <h3>Berat semasa</h3>
        <div className="value">78.4 kg</div>
        <div className="muted-text">Kemaskini mingguan</div>
      </div>

      <div className="card focus-card">
        <h2>Fokus malam ini</h2>
        <p>
          Ambil gambar makanan terus, atau upload gambar yang telah disimpan
          dalam telefon. GreenBites akan tunjukkan anggaran kalori, kos dan
          cadangan ringkas sebelum makan.
        </p>
      </div>

      <div className="action-column">
        <button className="snap-button" onClick={handleOpenCamera}>
          📸 Ambil Gambar
        </button>

        <button className="secondary-full-button" onClick={handleOpenGallery}>
          🖼️ Upload dari Galeri
        </button>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelected}
        style={{ display: 'none' }}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelected}
        style={{ display: 'none' }}
      />
    </div>
  )
}