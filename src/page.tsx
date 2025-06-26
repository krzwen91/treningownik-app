import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import './style.css'

type Activity = {
  distance?: string
  time?: string
  calories: string
}

type Day = {
  date: string
  running: Activity
  strength: Activity
}

const getMonthDays = (year: number, month: number) => {
  const days = []
  const firstDay = dayjs().year(year).month(month).date(1)
  const startDay = firstDay.day()
  const daysInMonth = firstDay.daysInMonth()

  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = dayjs().year(year).month(month).date(d).format('YYYY-MM-DD')
    days.push({
      date,
      running: { distance: '', time: '', calories: '' },
      strength: { calories: '' }
    })
  }

  return days
}

const STORAGE_KEY = 'treningownik-calendar'

export default function Calendar() {
  const today = dayjs()
  const [year] = useState(today.year())
  const [month] = useState(today.month())
  const [days, setDays] = useState<(Day | null)[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setDays(JSON.parse(saved))
    } else {
      setDays(getMonthDays(year, month))
    }
  }, [year, month])

  useEffect(() => {
    if (days.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(days))
    }
  }, [days])

  const updateField = (index: number, type: 'running' | 'strength', field: string, value: string) => {
    const copy = [...days]
    const day = copy[index]
    if (day) {
      day[type][field] = value
      setDays(copy)
    }
  }

  const totals = days.reduce(
    (acc, day) => {
      if (day) {
        acc.runningDistance += parseFloat(day.running.distance || '0')
        acc.runningTime += parseFloat(day.running.time || '0')
        acc.runningCalories += parseFloat(day.running.calories || '0')
        acc.strengthCalories += parseFloat(day.strength.calories || '0')
      }
      return acc
    },
    { runningDistance: 0, runningTime: 0, runningCalories: 0, strengthCalories: 0 }
  )

  return (
    <div className="calendar-app">
      <h1>Treningownik – Kalendarz</h1>
      <p>Miesiąc: {today.format('MMMM YYYY')}</p>
      <div className="summary">
        <strong>Bieganie:</strong> {totals.runningDistance} km, {totals.runningTime} min, {totals.runningCalories} kcal |
        <strong> Siłowe:</strong> {totals.strengthCalories} kcal
      </div>
      <div className="calendar-grid">
        {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => (
          <div key={d} className="day-header">{d}</div>
        ))}
        {days.map((day, i) => (
          <div key={i} className="calendar-cell">
            {day ? (
              <>
                <div className="date">{dayjs(day.date).date()}</div>
                <div className="activity">
                  <strong>Bieganie</strong>
                  <input placeholder="Dystans (km)" value={day.running.distance} onChange={e => updateField(i, 'running', 'distance', e.target.value)} />
                  <input placeholder="Czas (min)" value={day.running.time} onChange={e => updateField(i, 'running', 'time', e.target.value)} />
                  <input placeholder="Kalorie" value={day.running.calories} onChange={e => updateField(i, 'running', 'calories', e.target.value)} />
                </div>
                <div className="activity">
                  <strong>Siłowe</strong>
                  <input placeholder="Kalorie" value={day.strength.calories} onChange={e => updateField(i, 'strength', 'calories', e.target.value)} />
                </div>
              </>
            ) : (
              <div className="empty-cell" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}