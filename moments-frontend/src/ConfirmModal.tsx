import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Button, Typography } from '@mui/material'

export interface IConfirmModalProps {
    title: string
    message: string
    confirmButtonText: string
    cancelButtonText: string
    confirmCallback: Function
    cancelCallback: Function
}

const ConfirmModal = (props: IConfirmModalProps) => {
    const {
        title,
        message,
        cancelButtonText,
        confirmButtonText,
        confirmCallback,
        cancelCallback,
    } = props

    return (
        <Dialog
            open={true}
            onClose={(_) => cancelCallback()}
            //disableBackdropClick={false}
            disableEscapeKeyDown={false}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent
                style={{ marginTop: 10, marginBottom: 10, marginRight: 80 }}
            >
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={(_) => cancelCallback()}>
                    {cancelButtonText}
                </Button>
                <Button onClick={(_) => confirmCallback()}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmModal
