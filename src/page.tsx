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
      time: '',
      note: ''
    })
  }
  return days
}

export default function App() {
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem('treningownik-days')
    return saved ? JSON.parse(saved) : generateDays()
  })

  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    localStorage.setItem('treningownik-days', JSON.stringify(days))
  }, [days])

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [])

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

  const exportToCSV = () => {
    const header = 'Data,Trening,Zaliczony,Kalorie,Dystans (km),Czas (min),Notatka\n'
    const rows = days.map(d => 
      [d.date, d.completed ? '✅' : '', d.completed, d.calories, d.distance, d.time, d.note].join(',')
    )
    const csv = header + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'treningi.csv'
    link.click()
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
    <>
      {showSplash && <div className="splash">🚀 Treningownik ładuje się...</div>}
      <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
        <h1>Treningownik</h1>
        <p>Widok miesięczny, notatki, wykresy i eksport danych.</p>
        <button onClick={exportToCSV}>📤 Eksportuj dane do CSV</button>
        <div style={{ margin: '2rem 0' }}>
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
              <div style={{ marginTop: '0.5rem' }}>
                <textarea placeholder="Notatka" value={day.note} onChange={e => updateField(i, 'note', e.target.value)} rows={2} style={{ width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}