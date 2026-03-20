function SummaryCard({ icon, value, label, helper, tone = 'green' }) {
  return (
    <div className={`summary-card ${tone}`}>
      <div className="summary-icon">{icon}</div>
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
      <div className="summary-helper">{helper}</div>
    </div>
  )
}

export default SummaryCard
