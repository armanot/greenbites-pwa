import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadMealImage } from '../lib/uploadMealImage'
import { saveMealLog } from '../lib/saveMealLog'

export default function SnapResult() {
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState('')
  const [mealData, setMealData] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const storedImage = sessionStorage.getItem('greenbites_uploaded_image')
    if (storedImage) {
      setImageUrl(storedImage)
    }

    const storedAiResult = sessionStorage.getItem('greenbites_ai_result')
    if (storedAiResult) {
      try {
        setMealData(JSON.parse(storedAiResult))
      } catch (err) {
        console.error('Failed to parse AI result:', err)
      }
    }
  }, [])

  const handleRetake = () => {
    sessionStorage.removeItem('greenbites_uploaded_image')
    sessionStorage.removeItem('greenbites_uploaded_image_name')
    sessionStorage.removeItem('greenbites_ai_result')
    window.greenbitesSelectedFile = null
    navigate('/')
  }

  const handleLogMeal = async () => {
    try {
      setIsSaving(true)

      const file = window.greenbitesSelectedFile
      if (!file || !mealData) {
        alert('Missing meal data.')
        setIsSaving(false)
        return
      }

      const uploadedImageUrl = await uploadMealImage(file)

      const mealRecord = {
        image_url: uploadedImageUrl,
        meal_name: mealData.meal_name,
        calories: mealData.estimated_calories,
        cost: mealData.estimated_cost,
        impact: mealData.impact,
        created_at: new Date().toISOString(),
      }

      await saveMealLog(mealRecord)

      const currentCalories = Number(
        localStorage.getItem('greenbites_today_calories') || 0
      )
      const currentBudget = Number(
        localStorage.getItem('greenbites_today_budget') || 0
      )

      localStorage.setItem(
        'greenbites_today_calories',
        currentCalories + mealData.estimated_calories
      )
      localStorage.setItem(
        'greenbites_today_budget',
        currentBudget + mealData.estimated_cost
      )

      let existingMeals = []
      try {
        existingMeals = JSON.parse(
          localStorage.getItem('greenbites_recent_meals') || '[]'
        )
      } catch {
        existingMeals = []
      }

      const updatedMeals = [mealRecord, ...existingMeals].slice(0, 5)

      localStorage.setItem(
        'greenbites_recent_meals',
        JSON.stringify(updatedMeals)
      )

      setShowSuccess(true)

      setTimeout(() => {
        navigate('/')
      }, 1200)
    } catch (err) {
      console.error(err)
      alert(`Error: ${err.message}`)
      setIsSaving(false)
    }
  }

  if (!mealData) {
    return (
      <div className="page page-pro">
        <div className="card">
          <h2>No analysis result found</h2>
          <p>Please try scanning the meal again.</p>
          <button className="snap-button" onClick={() => navigate('/')}>
            Back Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page page-pro">
      <button className="back-link pro-back-link" onClick={() => navigate('/')}>
        ← Back
      </button>

      <div className="result-hero-card">
        <div className="result-hero-top">
          <div>
            <div className="brand-pill">GreenBites</div>
            <h1 className="result-title">Meal Analysis</h1>
            <p className="result-subtitle">
              We detected a likely meal match from your uploaded photo.
            </p>
          </div>
          <div className="confidence-badge">
            {mealData.confidence} confidence
          </div>
        </div>

        <div className="result-image-wrap">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Makanan yang diambil"
              className="meal-preview pro-meal-preview"
            />
          ) : (
            <div className="meal-placeholder">Tiada gambar dipilih</div>
          )}
        </div>

        <div className="detected-meal-card">
          <div className="detected-label">Detected meal</div>
          <div className="detected-name">{mealData.meal_name}</div>
        </div>
      </div>

      <div className="result-metrics-grid">
        <div className="result-metric-card danger-card">
          <div className="result-metric-label">Calories</div>
          <div className="result-metric-value">{mealData.estimated_calories}</div>
          <div className="result-metric-note">Estimated</div>
        </div>

        <div className="result-metric-card warning-card">
          <div className="result-metric-label">Cost</div>
          <div className="result-metric-value">RM {mealData.estimated_cost}</div>
          <div className="result-metric-note">Estimated</div>
        </div>

        <div className="result-metric-card success-card">
          <div className="result-metric-label">Impact</div>
          <div className="result-metric-value impact-text">Berat</div>
          <div className="result-metric-note">{mealData.impact}</div>
        </div>
      </div>

      <div className="card section-card">
        <div className="section-head">
          <div>
            <h2>Detected Items</h2>
            <p>Visual items identified from the meal photo.</p>
          </div>
        </div>

        <div className="suggestion-modern-list">
          {mealData.detected_items.map((item, index) => (
            <div key={index} className="suggestion-modern-item">
              <div className="suggestion-icon">•</div>
              <div className="suggestion-text">{item}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card section-card">
        <div className="section-head">
          <div>
            <h2>Smart Suggestions</h2>
            <p>Simple adjustments to make this meal more balanced.</p>
          </div>
        </div>

        <div className="suggestion-modern-list">
          {mealData.suggestions.map((item, index) => (
            <div key={index} className="suggestion-modern-item">
              <div className="suggestion-icon">✓</div>
              <div className="suggestion-text">{item}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card section-card">
        <div className="section-head">
          <div>
            <h2>Decision Summary</h2>
            <p>Quick note before you log this meal.</p>
          </div>
        </div>

        <div className="decision-summary-box">{mealData.health_notes}</div>
      </div>

      <div className="action-row sticky-action-row">
        <button className="secondary-button" onClick={handleRetake}>
          Retake
        </button>

        <button
          className="snap-button half-button"
          onClick={handleLogMeal}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Log Meal'}
        </button>
      </div>

      {showSuccess && (
        <div className="toast-success">✅ Meal berjaya disimpan</div>
      )}
    </div>
  )
}