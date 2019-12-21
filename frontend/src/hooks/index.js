import { useState } from 'react'

export const useField = (type, name, placeholder, options) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => setValue('')

  const attributes = { type, value, name, onChange, placeholder }

  return {
    attributes,
    reset
  }
}