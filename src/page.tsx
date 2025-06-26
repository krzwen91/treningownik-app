import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const today = dayjs()
const generateDays = () => {
  const days = []
  for (let i = 0; i < 30; i++) {
    const date = today.add(i, 'day')
    days.push({
      date: date.format('YYYY-MM-DD'),
      completed: false,
      calories: '',
      distance: '',
      time: ''
    })
  }
  return days
}

export default function App() {
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem('treningownik-days')
    return saved ? JSON.parse(saved) : generateDays()
  })

  useEffect(() => {
    localStorage.setItem('treningownik-days', JSON.stringify(days))
  }, [days])

  const toggleDay = (index: number) => {
    const copy = [...days]
    copy[index].completed = !copy[index].completed
    setDays(copy)
  }

  const updateField = (index: number, field: string, value: string) => {
    const copy = [...days]
    copy[index][field] = value
    setDays(copy)
  }

  const statsData = {
    labels: days.map(d => d.date),
    datasets: [
      {
        label: 'Kalorie',
        data: days.map(d => Number(d.calories || 0)),
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.2)'
      },
      {
        label: 'Dystans (km)',
        data: days.map(d => Number(d.distance || 0)),
        borderColor: 'green',
        backgroundColor: 'rgba(0,255,0,0.2)'
      }
    ]
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Treningownik</h1>
      <p>PWA + wykresy. Kliknij dzień, uzupełnij dane.</p>
      <div style={{ marginBottom: '3rem' }}>
        <Line data={statsData} />
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {days.map((day, i) => (
          <div key={day.date} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{day.date}</strong>
              <button onClick={() => toggleDay(i)}>
                {day.completed ? '✅' : '⬜'}
              </button>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <input placeholder="Kalorie" value={day.calories} onChange={e => updateField(i, 'calories', e.target.value)} style={{ marginRight: 8 }} />
              <input placeholder="Dystans (km)" value={day.distance} onChange={e => updateField(i, 'distance', e.target.value)} style={{ marginRight: 8 }} />
              <input placeholder="Czas (min)" value={day.time} onChange={e => updateField(i, 'time', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}