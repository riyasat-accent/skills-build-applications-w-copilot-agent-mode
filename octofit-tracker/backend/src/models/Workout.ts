import { Schema, model } from 'mongoose'

const WorkoutSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true })

export const Workout = model('Workout', WorkoutSchema)
