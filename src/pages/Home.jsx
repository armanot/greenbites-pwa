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

  const handleReset = () => {
    const confirmed = window.confirm('Reset semua data hari ini?')
    if (!confirmed) return

    localStorage.removeItem('greenbites_today_calories')
    localStorage.removeItem('greenbites_today_budget')
    localStorage.removeItem('greenbites_recent_meals')

    setCalories(0)
    setBudget(0)
    setRecentMeals([])
  }

  const caloriePercentRaw = (calories / 1800) * 100
  const budgetPercentRaw = (budget / 30) * 100

  const caloriePercent = Math.min(caloriePercentRaw, 100)
  const budgetPercent = Math.min(budgetPercentRaw, 100)

  const getStatus = (percent) => {
    if (percent < 70) return 'good'
    if (percent <= 100) return 'warning'
    return 'danger'
  }

  const calorieStatus = getStatus(caloriePercentRaw)
  const budgetStatus = getStatus(budgetPercentRaw)

  const getPercentLabel = (percent) => {
    if (percent > 100) {
      return `+${Math.round(percent - 100)}% OVER`
    }
    return `${Math.round(percent)}%`
  }

  const getCoachMessage = () => {
    if (calories > 3000) {
      return '⚠️ You are significantly over your calorie target today. Skip heavy dinner and choose light meals like soup, fruits, or salad.'
    }

    if (calories > 1800) {
      return '⚠️ You exceeded your calorie target. Try lighter meals for the rest of the day.'
    }

    if (budget > 30) {
      return '💸 You exceeded your food budget today. Consider simpler or home-cooked meals next.'
    }

    if (recentMeals.length === 0) {
      return '👋 Start by snapping your first meal. GreenBites will help you track calories and spending.'
    }

    return '✅ You are doing well today. Keep your meals balanced and consistent.'
  }

  const getNextMealSuggestion = () => {
    if (calories > 1800) {
      return 'Go for light options: soup, salad, fruits, or grilled chicken.'
    }

    if (budget > 30) {
      return 'Choose a lower-cost meal: home-cooked rice, eggs, vegetables, or soup.'
    }

    return 'Balanced meal idea: rice + protein + vegetables + plain water.'
  }

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
          <p className="dashboard-subtitle">
            {today} • Track smarter, eat better.
          </p>
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

      <div className="card ai-coach-card">
        <h2>🧠 AI Coach</h2>
        <p>{getCoachMessage()}</p>
      </div>

      <div className="card next-meal-card">
        <h3>🍽️ Next Meal Suggestion</h3>
        <p>{getNextMealSuggestion()}</p>
      </div>

      <div className="metrics-grid">
        <div className={`metric-card ${calorieStatus}`}>
          <div className="metric-header">
            <span>Calories</span>
            <span>{getPercentLabel(caloriePercentRaw)}</span>
          </div>
          <div className="metric-value">{calories} / 1800 kcal</div>
          <div className="progress-track modern">
            <div
              className={`progress-fill ${
                calorieStatus === 'danger'
                  ? 'red-fill'
                  : calorieStatus === 'warning'
                  ? 'orange-fill'
                  : 'green-fill'
              }`}
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
        </div>

        <div className={`metric-card ${budgetStatus}`}>
          <div className="metric-header">
            <span>Budget</span>
            <span>{getPercentLabel(budgetPercentRaw)}</span>
          </div>
          <div className="metric-value">RM {budget} / RM 30</div>
          <div className="progress-track modern">
            <div
              className={`progress-fill ${
                budgetStatus === 'danger'
                  ? 'red-fill'
                  : budgetStatus === 'warning'
                  ? 'orange-fill'
                  : 'green-fill'
              }`}
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
          <div className="metric-note">
            Based on meal pattern and balance
          </div>
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
            📸 Snap Pic
          </button>

          <button className="secondary-full-button" onClick={handleOpenGallery}>
            🖼️ Upload dari Galeri
          </button>

          <button className="reset-button" onClick={handleReset}>
            🔄 Reset Today
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