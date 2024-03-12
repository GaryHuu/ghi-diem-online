import { IconButton, Stack, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

function InputScore() {
  return (
    <Stack direction='row' alignItems='center'>
      <IconButton>
        <RemoveIcon />
      </IconButton>
      <TextField
        defaultValue={0}
        sx={{
          flex: 1,
          maxWidth: '100px',
          '.MuiInputBase-input': {
            textAlign: 'center',
          },
        }}
        type='number'
        size='small'
      />
      <IconButton>
        <AddIcon />
      </IconButton>
    </Stack>
  )
}

export default InputScore
