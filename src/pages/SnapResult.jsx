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
    navigate('/')
  }

 const handleLogMeal = async () => {
  try {
    const file = window.greenbitesSelectedFile

    if (!file) {
      alert('Tiada fail gambar ditemui.')
      return
    }

    const uploadedImageUrl = await uploadMealImage(file)

    await saveMealLog({
      image_url: uploadedImageUrl,
      meal_name: mealData.name,
      calories: mealData.calories,
      cost: mealData.cost,
      impact: mealData.impact,
    })

    const currentCalories = Number(
      localStorage.getItem('greenbites_today_calories') || 1180
    )
    const currentBudget = Number(
      localStorage.getItem('greenbites_today_budget') || 22
    )

    localStorage.setItem(
      'greenbites_today_calories',
      currentCalories + mealData.calories
    )
    localStorage.setItem(
      'greenbites_today_budget',
      currentBudget + mealData.cost
    )

    alert('Meal logged to Supabase successfully.')
    navigate('/')
  } catch (err) {
    console.error(err)
    alert(`Error: ${err.message}`)
  }
}

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate('/')}>
        ← Kembali
      </button>

      <div className="card">
        <div className="brand">GreenBites</div>
        <h1>Analisis Makanan</h1>
        <p>Detected meal: {mealData.name}</p>
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
          <div className="stat-value">{mealData.calories}</div>
          <div className="stat-note">Above Target</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-title">Kos</div>
          <div className="stat-value">RM {mealData.cost}</div>
          <div className="stat-note">Within Budget</div>
        </div>

        <div className="stat-card success">
          <div className="stat-title">Impak</div>
          <div className="stat-value small-text">Berat</div>
          <div className="stat-note">{mealData.impact}</div>
        </div>
      </div>

      <div className="card">
        <h2>Cadangan</h2>
        <ul className="suggestion-list">
          {mealData.suggestions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="action-row">
        <button className="secondary-button" onClick={handleRetake}>
          Retake
        </button>
        <button className="snap-button half-button" onClick={handleLogMeal}>
          Log Meal
        </button>
      </div>
    </div>
  )
}