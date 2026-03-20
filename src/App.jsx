import { useMemo, useState } from 'react'
import Home from './pages/Home'
import SnapResult from './pages/SnapResult'
import { sampleMeal } from './data/meals'

function App() {
  const [screen, setScreen] = useState('home')
  const [dailyLog, setDailyLog] = useState(() => {
    const saved = localStorage.getItem('greenbites-daily-log')
    return saved
      ? JSON.parse(saved)
      : { calories: 1180, budget: 22, targetCalories: 1800, dailyBudget: 30, weightKg: 78.4 }
  })

  const meal = useMemo(() => sampleMeal, [])

  const handleLogMeal = () => {
    const updated = {
      ...dailyLog,
      calories: dailyLog.calories + meal.calories,
      budget: +(dailyLog.budget + meal.cost).toFixed(2),
    }
    setDailyLog(updated)
    localStorage.setItem('greenbites-daily-log', JSON.stringify(updated))
    setScreen('home')
  }

  return (
    <div className="app-shell">
      {screen === 'home' ? (
        <Home
          dailyLog={dailyLog}
          onStartSnap={() => setScreen('result')}
        />
      ) : (
        <SnapResult
          meal={meal}
          dailyLog={dailyLog}
          onBack={() => setScreen('home')}
          onLogMeal={handleLogMeal}
        />
      )}
    </div>
  )
}

export default App
