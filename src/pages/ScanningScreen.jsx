import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ScanningScreen() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const scanSteps = [
    'Photo received',
    'Detecting meal composition',
    'Estimating calories and cost',
    'Preparing smart suggestions',
  ]

  useEffect(() => {
    const stepTimers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1000),
      setTimeout(() => setStep(3), 1500),
      setTimeout(() => navigate('/snap-result'), 2200),
    ]

    return () => {
      stepTimers.forEach(clearTimeout)
    }
  }, [navigate])

  return (
    <div className="page page-pro centered-page">
      <div className="scan-hero-card">
        <div className="brand-pill">GreenBites</div>

        <div className="scan-icon-wrap">
          <div className="scan-pulse-ring"></div>
          <div className="scan-icon-core">📸</div>
        </div>

        <h1 className="scan-title">Scanning your meal...</h1>
        <p className="scan-subtitle">
          We are analysing the uploaded image and preparing a quick nutrition
          and budget summary for you.
        </p>

        <div className="scan-progress-bar">
          <div
            className="scan-progress-fill"
            style={{ width: `${((step + 1) / scanSteps.length) * 100}%` }}
          />
        </div>

        <div className="scan-steps-modern">
          {scanSteps.map((item, index) => (
            <div
              key={index}
              className={`scan-step-item ${index <= step ? 'active' : ''}`}
            >
              <div className="scan-step-indicator">
                {index < step ? '✓' : index === step ? '●' : '○'}
              </div>
              <div className="scan-step-text">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}