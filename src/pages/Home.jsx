import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const navigate = useNavigate()

  const [calories, setCalories] = useState(0)
  const [budget, setBudget] = useState(0)
  const [recentMeals, setRecentMeals] = useState([])

  useEffect(() => {
    const loadDashboardData = () => {
      const storedCalories = Number(
        localStorage.getItem('greenbites_today_calories') || 0
      )
      const storedBudget = Number(
        localStorage.getItem('greenbites_today_budget') || 0
      )
      const storedMeals = JSON.parse(
        localStorage.getItem('greenbites_recent_meals') || '[]'
      )

      setCalories(storedCalories)
      setBudget(storedBudget)
      setRecentMeals(storedMeals)
    }

    loadDashboardData()
    window.addEventListener('focus', loadDashboardData)

    return () => {
      window.removeEventListener('focus', loadDashboardData)
    }
  }, [])

  const handleOpenCamera = () => {
    cameraInputRef.current?.click()
  }

  const handleOpenGallery = () => {
    galleryInputRef.current?.click()
  }

  const handleImageSelected = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)

    sessionStorage.setItem('greenbites_uploaded_image', imageUrl)
    sessionStorage.setItem('greenbites_uploaded_image_name', file.name)

    window.greenbitesSelectedFile = file

    navigate('/scanning')
  }

  const caloriePercent = Math.min((calories / 1800) * 100, 100)
  const budgetPercent = Math.min((budget / 30) * 100, 100)

  return (
    <div className="page">
      <div className="card hero-card">
        <div className="brand">GreenBites</div>
        <h1>Dashboard Harian</h1>
        <p className="hero-text">
          Pantau kalori, bajet makanan dan berat badan dalam satu skrin.
        </p>
      </div>

      <div className="card summary-card">
        <h2>Today Summary</h2>
        <p>{recentMeals.length} meals logged</p>
        <p>{calories} kcal consumed</p>
        <p>RM {budget} spent</p>
      </div>

      <div className="card">
        <h3>Kalori hari ini</h3>
        <div className="value">{calories} / 1800 kcal</div>
        <div className="progress-track">
          <div
            className="progress-fill green-fill"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
      </div>

      <div className="card">
        <h3>Bajet hari ini</h3>
        <div className="value">RM {budget} / RM 30</div>
        <div className="progress-track">
          <div
            className="progress-fill orange-fill"
            style={{ width: `${budgetPercent}%` }}
          />
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

      {recentMeals.length === 0 && (
        <div className="card">
          <h3>No meals yet</h3>
          <p>Start by snapping your first meal 🍽️</p>
        </div>
      )}

      {recentMeals.length > 0 && (
        <div className="card">
          <h2>Recent Meals</h2>

          {recentMeals.map((meal, index) => (
            <div key={index} className="meal-item">
              <img
                src={meal.image_url}
                alt={meal.meal_name}
                className="meal-thumb"
              />

              <div className="meal-info">
                <div className="meal-name">{meal.meal_name}</div>
                <div className="meal-meta">
                  {meal.calories} kcal • RM {meal.cost}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}