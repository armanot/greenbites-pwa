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

      let storedMeals = []
      try {
        storedMeals = JSON.parse(
          localStorage.getItem('greenbites_recent_meals') || '[]'
        )
      } catch {
        storedMeals = []
      }

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

  const today = new Date().toLocaleDateString('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="page page-pro">
      <div className="topbar">
        <div>
          <div className="brand-pill">GreenBites</div>
          <h1 className="dashboard-title">Good evening</h1>
          <p className="dashboard-subtitle">{today} • Track smarter, eat better.</p>
        </div>
      </div>

      <div className="hero-summary">
        <div className="hero-summary-left">
          <h2>Today Summary</h2>
          <p className="hero-summary-text">
            {recentMeals.length} meals logged today
          </p>
        </div>

        <div className="hero-summary-stats">
          <div className="hero-stat">
            <span className="hero-stat-label">Calories</span>
            <strong>{calories}</strong>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Spent</span>
            <strong>RM {budget}</strong>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>Calories</span>
            <span>{Math.round(caloriePercent)}%</span>
          </div>
          <div className="metric-value">{calories} / 1800 kcal</div>
          <div className="progress-track modern">
            <div
              className="progress-fill green-fill"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Budget</span>
            <span>{Math.round(budgetPercent)}%</span>
          </div>
          <div className="metric-value">RM {budget} / RM 30</div>
          <div className="progress-track modern">
            <div
              className="progress-fill orange-fill"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Weight</span>
            <span>Weekly</span>
          </div>
          <div className="metric-value">78.4 kg</div>
          <div className="metric-note">Last updated this week</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Health Score</span>
            <span>Beta</span>
          </div>
          <div className="metric-value">78 / 100</div>
          <div className="metric-note">Based on meal pattern and balance</div>
        </div>
      </div>

      <div className="card section-card">
        <div className="section-head">
          <div>
            <h2>Quick Actions</h2>
            <p>Snap now or upload from your gallery.</p>
          </div>
        </div>

        <div className="action-column">
          <button className="snap-button" onClick={handleOpenCamera}>
            📸 Snap
          </button>

          <button className="secondary-full-button" onClick={handleOpenGallery}>
            🖼️ Upload dari Galeri
          </button>
        </div>
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
        <div className="card empty-state-card">
          <div className="empty-icon">🍽️</div>
          <h3>No meals yet</h3>
          <p>Start by snapping your first meal and build today’s summary.</p>
        </div>
      )}

      {recentMeals.length > 0 && (
        <div className="card section-card">
          <div className="section-head">
            <div>
              <h2>Recent Meals</h2>
              <p>Your latest logged meals</p>
            </div>
          </div>

          <div className="recent-list">
            {recentMeals.map((meal, index) => (
              <div key={index} className="meal-item pro-meal-item">
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

                <div className="meal-badge">
                  {meal.impact || 'Tracked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}