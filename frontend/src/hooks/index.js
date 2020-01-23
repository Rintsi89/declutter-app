import { useState } from 'react'

export const useField = (type, name, placeholder, initialValue) => {

  const checkedValue = !initialValue ? '' : initialValue
  const [value, setValue] = useState(checkedValue)

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => setValue('')
  const initialize = () => setValue(initialValue)

  const attributes = { type, value, name, onChange, placeholder, }

  return {
    attributes,
    reset,
    initialize
  }
}