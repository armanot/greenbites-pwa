import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadMealImage } from '../lib/uploadMealImage'
import { saveMealLog } from '../lib/saveMealLog'

const sampleMeals = [
  {
    name: 'Nasi ayam goreng',
    calories: 680,
    cost: 12,
    impact: 'Weight Gain Likely',
    confidence: 'High confidence',
    suggestions: [
      'Kurangkan nasi sedikit',
      'Elakkan air manis',
      'Tambah sayur jika ada',
    ],
  },
  {
    name: 'Nasi campur ayam dan sayur',
    calories: 540,
    cost: 10,
    impact: 'Slightly Above Target',
    confidence: 'Medium confidence',
    suggestions: [
      'Pilih lauk bakar jika ada',
      'Kurangkan kuah manis',
      'Tambah air kosong',
    ],
  },
  {
    name: 'Mee goreng',
    calories: 620,
    cost: 9,
    impact: 'High Carb Meal',
    confidence: 'Medium confidence',
    suggestions: [
      'Ambil portion sederhana',
      'Elakkan minuman bergula',
      'Seimbangkan dengan buah selepas itu',
    ],
  },
]

export default function SnapResult() {
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState('')
  const [mealData, setMealData] = useState(sampleMeals[0])
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const storedImage = sessionStorage.getItem('greenbites_uploaded_image')
    if (storedImage) {
      setImageUrl(storedImage)
    }

    const randomMeal =
      sampleMeals[Math.floor(Math.random() * sampleMeals.length)]
    setMealData(randomMeal)
  }, [])

  const handleRetake = () => {
    sessionStorage.removeItem('greenbites_uploaded_image')
    sessionStorage.removeItem('greenbites_uploaded_image_name')
    window.greenbitesSelectedFile = null
    navigate('/')
  }

  const handleLogMeal = async () => {
    try {
      setIsSaving(true)

      const file = window.greenbitesSelectedFile
      if (!file) {
        alert('Tiada fail gambar ditemui.')
        setIsSaving(false)
        return
      }

      const uploadedImageUrl = await uploadMealImage(file)

      const mealRecord = {
        image_url: uploadedImageUrl,
        meal_name: mealData.name,
        calories: mealData.calories,
        cost: mealData.cost,
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
        currentCalories + mealData.calories
      )
      localStorage.setItem(
        'greenbites_today_budget',
        currentBudget + mealData.cost
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
          <div className="confidence-badge">{mealData.confidence}</div>
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
          <div className="detected-name">{mealData.name}</div>
        </div>
      </div>

      <div className="result-metrics-grid">
        <div className="result-metric-card danger-card">
          <div className="result-metric-label">Calories</div>
          <div className="result-metric-value">{mealData.calories}</div>
          <div className="result-metric-note">Above Target</div>
        </div>

        <div className="result-metric-card warning-card">
          <div className="result-metric-label">Cost</div>
          <div className="result-metric-value">RM {mealData.cost}</div>
          <div className="result-metric-note">Within Budget</div>
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
            <p>This meal can still fit your day with a few mindful choices.</p>
          </div>
        </div>

        <div className="decision-summary-box">
          This meal is a moderate-to-high calorie option. It remains within a
          reasonable budget range, but reducing carbohydrates or sugary drinks
          can improve your daily balance.
        </div>
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
        <div className="toast-success">
          ✅ Meal berjaya disimpan
        </div>
      )}
    </div>
  )
}