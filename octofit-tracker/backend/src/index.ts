import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Workout } from './models/Workout'

dotenv.config()

const PORT = Number(process.env.PORT ?? 8000)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/workouts', async (req, res) => {
  const workouts = await Workout.find().sort({ createdAt: -1 })
  res.json(workouts)
})

app.post('/api/workouts', async (req, res) => {
  try {
    const { name, duration, notes } = req.body
    const workout = await Workout.create({ name, duration, notes })
    res.status(201).json(workout)
  } catch (error) {
    res.status(400).json({ error: 'Invalid workout data' })
  }
})

async function start() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB:', MONGO_URI)
    app.listen(PORT, '127.0.0.1', () => console.log(`Server listening on http://127.0.0.1:${PORT}`))
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
