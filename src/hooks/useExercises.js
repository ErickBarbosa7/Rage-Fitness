import { useState, useEffect } from 'react'
import { exerciseService } from '../features/exercises/exerciseService'

export function useExercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true)
        const data = await exerciseService.getAll()
        setExercises(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  return { exercises, loading, error }
}