import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'

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

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Treningownik</h1>
      <p>Kliknij dzień, by oznaczyć trening. Uzupełnij dane.</p>
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
              <input
                placeholder="Kalorie"
                value={day.calories}
                onChange={e => updateField(i, 'calories', e.target.value)}
                style={{ marginRight: 8 }}
              />
              <input
                placeholder="Dystans (km)"
                value={day.distance}
                onChange={e => updateField(i, 'distance', e.target.value)}
                style={{ marginRight: 8 }}
              />
              <input
                placeholder="Czas (min)"
                value={day.time}
                onChange={e => updateField(i, 'time', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}