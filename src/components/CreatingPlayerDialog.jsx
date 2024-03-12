import ConfirmModal from '@/components/ConfirmModal'
import { Button, TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import PropTypes from 'prop-types'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

const MIN_LENGTH = 2
const MAX_LENGTH = 16
const MODE = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const CreatingPlayerDialog = forwardRef(
  ({ children, onSubmit = () => {} }, ref) => {
    const [mode, setMode] = useState(MODE.CREATE)
    const confirmActionRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const editedPlayerRef = useRef(null)
    const [name, setName] = useState('')
    const [isDirty, setIsDirty] = useState(false)

    const invalid =
      name.trim().length < MIN_LENGTH || name.trim().length > MAX_LENGTH

    const isError = invalid && isDirty

    const helperText = isError
      ? `Vui lòng nhập từ ${MIN_LENGTH} đến ${MAX_LENGTH} kí tự`
      : ''

    const handleNameChange = (event) => {
      if (event.target.value.length <= MAX_LENGTH) {
        setName(event.target.value)
      }
    }

    const handleSubmit = () => {
      if (invalid) {
        setIsDirty(true)
        return
      }

      if (mode === MODE.CREATE) {
        onSubmit(name)
      }

      if (mode === MODE.EDIT) {
        onSubmit(name, editedPlayerRef.current?.id)
      }

      handleClose()
    }

    const handleClose = () => {
      setIsOpen(false)
      setIsDirty(false)
      setName('')
      setMode(MODE.CREATE)
      editedPlayerRef.current = null
    }

    useImperativeHandle(ref, () => ({
      editPlayerName: (player) => {
        setIsOpen(true)
        setMode(MODE.EDIT)
        setName(player.name)
        editedPlayerRef.current = player
      },
    }))

    return (
      <>
        {React.cloneElement(children, {
          onClick: () => setIsOpen(true),
        })}
        <Dialog
          onClose={handleClose}
          open={isOpen}
          TransitionComponent={Transition}
          scroll='paper'
          fullWidth
        >
          <DialogTitle>
            {mode === MODE.CREATE ? 'Thêm người chơi' : 'Sửa tên người chơi'}
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              padding: '1.5rem 1rem 1rem',
            }}
          >
            <TextField
              error={isError}
              label='Tên người chơi'
              id='name-of-player'
              size='small'
              value={name}
              onChange={handleNameChange}
              onBlur={() => setIsDirty(true)}
              sx={{ width: '100%' }}
              helperText={helperText}
            />
            <Button
              sx={{ mt: '1rem', width: '100%' }}
              variant='contained'
              size='small'
              disabled={isError}
              onClick={handleSubmit}
            >
              {mode === MODE.CREATE ? 'Tạo' : 'Sửa'}
            </Button>
          </DialogContent>
        </Dialog>
        <ConfirmModal ref={confirmActionRef} />
      </>
    )
  }
)

CreatingPlayerDialog.displayName = 'CreatingPlayerDialog'

CreatingPlayerDialog.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func,
}

export default CreatingPlayerDialog
