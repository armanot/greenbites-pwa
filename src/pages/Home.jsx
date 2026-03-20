function Home({ dailyLog, onStartSnap }) {
  const caloriePct = Math.min(100, Math.round((dailyLog.calories / dailyLog.targetCalories) * 100))
  const budgetPct = Math.min(100, Math.round((dailyLog.budget / dailyLog.dailyBudget) * 100))

  return (
    <main className="screen">
      <header className="hero">
        <div>
          <p className="eyebrow">GreenBites</p>
          <h1>Dashboard Harian</h1>
          <p className="muted">Pantau kalori, bajet makanan dan berat badan dalam satu skrin.</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <div className="metric-card">
          <span>Kalori hari ini</span>
          <strong>{dailyLog.calories} / {dailyLog.targetCalories} kcal</strong>
          <div className="progress"><div style={{ width: `${caloriePct}%` }} /></div>
        </div>

        <div className="metric-card">
          <span>Bajet hari ini</span>
          <strong>RM {dailyLog.budget} / RM {dailyLog.dailyBudget}</strong>
          <div className="progress orange"><div style={{ width: `${budgetPct}%` }} /></div>
        </div>

        <div className="metric-card">
          <span>Berat semasa</span>
          <strong>{dailyLog.weightKg} kg</strong>
          <small className="muted">Update mingguan</small>
        </div>
      </section>

      <section className="panel">
        <h3>Fokus malam ini</h3>
        <p className="muted">
          Cuba aliran paling ringkas: tekan butang di bawah, simulasi “snap makanan”, dan lihat
          paparan cadangan sebelum makan.
        </p>
      </section>

      <button className="primary-btn" onClick={onStartSnap}>
        📸 Snap Meal
      </button>
    </main>
  )
}

export default Home
