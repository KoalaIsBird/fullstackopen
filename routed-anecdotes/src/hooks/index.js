import { useState } from "react"

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    const getInputAttributes = () => {
        return {
            value,
            onChange,
            type
        }
    }

    return {
        getInputAttributes,
        reset,
        value
    }
}