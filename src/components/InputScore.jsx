import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { IconButton, Stack, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

function InputScore({ value = 0, onChange = () => {}, gap = 1 }) {
  const [currentValue, setCurrentValue] = useState(value)

  const handleInputChange = (e) => {
    const newValue = e.target.value

    setCurrentValue(newValue)
  }

  const handleInputBlur = () => {
    console.log('currentValue', currentValue)
  }

  const handleDecrease = () => {
    onChange(value - gap)
  }

  const handleIncrease = () => {
    onChange(value + gap)
  }

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  return (
    <Stack direction='row' alignItems='center'>
      <IconButton onClick={handleDecrease}>
        <RemoveIcon />
      </IconButton>
      <TextField
        defaultValue={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        sx={{
          flex: 1,
          maxWidth: '100px',
          '.MuiInputBase-input': {
            textAlign: 'center',
          },
        }}
        inputMode='numeric'
        type='text'
        size='small'
      />
      <IconButton onClick={handleIncrease}>
        <AddIcon />
      </IconButton>
    </Stack>
  )
}

InputScore.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  gap: PropTypes.number,
}

export default InputScore
