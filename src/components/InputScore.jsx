import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { IconButton, Stack, TextField } from '@mui/material'
import PropTypes from 'prop-types'

function InputScore({ value = 0, onChange = () => {}, gap = 1 }) {
  const handleInputChange = (e) => {
    const newValue = +e.target.value

    if (!isNaN(newValue)) {
      onChange(parseInt(newValue, 10))
    }
  }

  const handleDecrease = () => {
    onChange(value - gap)
  }

  const handleIncrease = () => {
    onChange(value + gap)
  }

  return (
    <Stack direction='row' alignItems='center'>
      <IconButton onClick={handleDecrease}>
        <RemoveIcon />
      </IconButton>
      <TextField
        value={value}
        onChange={handleInputChange}
        sx={{
          flex: 1,
          maxWidth: '100px',
          '.MuiInputBase-input': {
            textAlign: 'center',
          },
        }}
        type='string'
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
