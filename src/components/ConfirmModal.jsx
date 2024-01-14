import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import React, { useImperativeHandle, useRef, useState } from 'react'

const ConfirmModal = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const confirmCallback = useRef(null)

  useImperativeHandle(ref, () => ({
    confirm: (callback) => {
      setIsOpen(true)
      confirmCallback.current = callback
    },
  }))

  const handleConfirm = () => {
    setIsOpen(false)
    confirmCallback.current && confirmCallback.current()
  }

  const handleCancel = () => {
    setIsOpen(false)
    confirmCallback.current = null
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>Xác nhận</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Bạn có muốn thực hiện hành động này không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color='inherit'>
          Không
        </Button>
        <Button onClick={handleConfirm} autoFocus>
          Có
        </Button>
      </DialogActions>
    </Dialog>
  )
})

ConfirmModal.displayName = 'Confirm Modal'

export default ConfirmModal
