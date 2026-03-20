import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fileToBase64 } from '../lib/fileToBase64'

export default function ScanningScreen() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')

  const scanSteps = [
    'Photo received',
    'Detecting meal composition',
    'Estimating calories and cost',
    'Preparing smart suggestions',
  ]

  useEffect(() => {
    let cancelled = false

    const runAnalysis = async () => {
      try {
        const file = window.greenbitesSelectedFile

        if (!file) {
          throw new Error('No selected image found')
        }

        setStep(1)

        const imageBase64 = await fileToBase64(file)
        if (cancelled) return

        setStep(2)

        const response = await fetch('/api/analyze-meal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64,
            mimeType: file.type || 'image/jpeg',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Analysis failed')
        }

        if (cancelled) return

        setStep(3)

        sessionStorage.setItem('greenbites_ai_result', JSON.stringify(data))

        setTimeout(() => {
          navigate('/snap-result')
        }, 500)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Analysis failed')
      }
    }

    runAnalysis()

    return () => {
      cancelled = true
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

        {error && (
          <div style={{ marginTop: 16, color: '#b91c1c', fontWeight: 600 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}