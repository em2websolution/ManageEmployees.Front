// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DialogsConfirmation = ({ open, onConfirm, onCancel }: Props) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      closeAfterTransition={false}
    >
      <DialogTitle id='alert-dialog-title'>Are you sure you want to remove the user?</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          This action cannot be undone and all associated data will be permanently deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogsConfirmation
