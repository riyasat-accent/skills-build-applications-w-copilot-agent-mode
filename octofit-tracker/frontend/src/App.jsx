import React, { useEffect, useState } from 'react'

export default function App() {
  const [workouts, setWorkouts] = useState([])
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/workouts')
      .then((res) => res.json())
      .then(setWorkouts)
      .catch(() => setStatus('Failed to load workouts'))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('Saving...')

    const payload = {
      name,
      duration: Number(duration),
      notes
    }

    const response = await fetch('http://127.0.0.1:8000/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      setStatus('Failed to save workout')
      return
    }

    const workout = await response.json()
    setWorkouts((current) => [workout, ...current])
    setName('')
    setDuration('')
    setNotes('')
    setStatus('Workout saved!')
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>OctoFit Tracker</h1>
      <p>Track workouts and save them to MongoDB.</p>

      <section style={{ marginBottom: 24 }}>
        <h2>New Workout</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <label>
            Duration (minutes)
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%' }} />
          </label>
          <button type="submit">Save workout</button>
        </form>
        {status && <p>{status}</p>}
      </section>

      <section>
        <h2>Workout History</h2>
        {workouts.length === 0 ? (
          <p>No workouts yet.</p>
        ) : (
          <ul>
            {workouts.map((workout) => (
              <li key={workout._id} style={{ marginBottom: 12 }}>
                <strong>{workout.name}</strong> — {workout.duration} min
                <div>{workout.notes}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
