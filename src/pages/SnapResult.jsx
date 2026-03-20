import SummaryCard from '../components/SummaryCard'
import SuggestionList from '../components/SuggestionList'

function SnapResult({ meal, dailyLog, onBack, onLogMeal }) {
  const projectedCalories = dailyLog.calories + meal.calories
  const projectedBudget = +(dailyLog.budget + meal.cost).toFixed(2)

  return (
    <main className="screen no-pad">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack}>←</button>
        <h2>Snap Result</h2>
        <div style={{ width: 40 }} />
      </header>

      <img className="meal-image" src={meal.image} alt={meal.name} />

      <section className="content">
        <div className="meal-title-wrap">
          <h1>{meal.name}</h1>
          <p className="muted">Anggaran berdasarkan imej dan saiz hidangan standard.</p>
        </div>

        <div className="summary-grid">
          <SummaryCard
            icon="🔥"
            value={`${meal.calories}`}
            label="Kalori"
            helper={meal.calorieStatus}
            tone="red"
          />
          <SummaryCard
            icon="💸"
            value={`RM ${meal.cost}`}
            label="Kos"
            helper={meal.budgetStatus}
            tone="orange"
          />
          <SummaryCard
            icon="⚖️"
            value="Impact"
            label="Berat"
            helper={meal.weightImpact}
            tone="green"
          />
        </div>

        <div className="panel compact">
          <h3>Ringkasan selepas log</h3>
          <div className="mini-stats">
            <div>
              <span>Kalori harian</span>
              <strong>{projectedCalories} kcal</strong>
            </div>
            <div>
              <span>Bajet harian</span>
              <strong>RM {projectedBudget}</strong>
            </div>
          </div>
        </div>

        <SuggestionList items={meal.suggestions} />

        <button className="primary-btn" onClick={onLogMeal}>
          Log Meal
        </button>
      </section>
    </main>
  )
}

export default SnapResult
