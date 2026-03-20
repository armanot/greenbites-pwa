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
    const confirmed = window.confirm('Reset all of today’s data?')
    if (!confirmed) return

    localStorage.removeItem('greenbites_today_calories')
    localStorage.removeItem('greenbites_today_budget')
    localStorage.removeItem('greenbites_recent_meals')

    setCalories(0)
    setBudget(0)
    setRecentMeals([])
  }

  const calorieTarget = 1800
  const budgetTarget = 30

  const caloriePercentRaw = (calories / calorieTarget) * 100
  const budgetPercentRaw = (budget / budgetTarget) * 100

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
      return 'You are significantly over your calorie target today. Choose a much lighter next meal such as soup, fruit, or salad.'
    }

    if (calories > calorieTarget) {
      return 'You are over your calorie target today. Consider a lighter next meal to rebalance your intake.'
    }

    if (budget > budgetTarget) {
      return 'You have exceeded your daily food budget. A simpler or home-cooked next meal may help you stay on track.'
    }

    if (recentMeals.length === 0) {
      return 'Start by scanning your first meal. GreenBites will help you track calories, cost, and smart meal choices.'
    }

    return 'You are doing well today. Keep your meals balanced and consistent.'
  }

  const getNextMealSuggestion = () => {
    if (calories > calorieTarget) {
      return 'Try a light option next: soup, grilled chicken, fruit, or salad with plain water.'
    }

    if (budget > budgetTarget) {
      return 'Consider a lower-cost option next: rice, eggs, vegetables, soup, or another simple home meal.'
    }

    return 'A balanced next meal could be protein, vegetables, a moderate carb portion, and plain water.'
  }

  const today = new Date().toLocaleDateString('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="page-pro">
      <div className="topbar">
        <div className="brand-pill">GreenBites</div>
        <h1 className="dashboard-title">Good Evening</h1>
        <p className="dashboard-subtitle">
          {today} • Track smarter, eat better.
        </p>
      </div>

      <div className="hero-summary">
        <h2>Today Summary</h2>
        <p className="hero-summary-text">
          {recentMeals.length} meals logged today
        </p>

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
          <div className="metric-value">
            {calories} / {calorieTarget} kcal
          </div>
          <div className="progress-track">
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
          <div className="metric-value">
            RM {budget} / RM {budgetTarget}
          </div>
          <div className="progress-track">
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
          <h2>Quick Actions</h2>
          <p>Scan or upload a meal to get instant insights.</p>
        </div>

        <div className="action-column">
          <button className="snap-button" onClick={handleOpenCamera}>
            📸 Scan Meal
          </button>

          <button className="secondary-button" onClick={handleOpenGallery}>
            🖼️ Choose from Gallery
          </button>

          <button className="reset-button" onClick={handleReset}>
            Reset Today
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
          <h3>No meals logged yet</h3>
          <p>
            Start by scanning your first meal to build your daily summary.
          </p>
        </div>
      )}

      {recentMeals.length > 0 && (
        <div className="card section-card">
          <div className="section-head">
            <h2>Recent Meals</h2>
            <p>Your latest logged meals</p>
          </div>

          <div className="recent-list">
            {recentMeals.map((meal, index) => (
              <div key={index} className="pro-meal-item">
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