import { useEffect, useState } from 'react'

function readValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => readValue(key, defaultValue))

  useEffect(() => {
    if (typeof window === 'undefined') return
    
      window.localStorage.setItem(key, JSON.stringify(value))
   
  }, [key, value])

  return [value, setValue] as const
}

