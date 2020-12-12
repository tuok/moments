import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button, Typography } from '@material-ui/core'

export interface IConfirmModalProps {
    title: string
    message: string
    confirmButtonText: string
    cancelButtonText: string
    confirmCallback: Function
    cancelCallback: Function
}

const ConfirmModal = (props: IConfirmModalProps) => {
    const { title, message, cancelButtonText, confirmButtonText, confirmCallback, cancelCallback } = props

    return (
        <Dialog open={true} onClose={e => cancelCallback()} disableBackdropClick={false} disableEscapeKeyDown={false}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent style={{ marginTop: 10, marginBottom: 10, marginRight: 80 }}>
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={e => cancelCallback()}>{cancelButtonText}</Button>
                <Button onClick={e => confirmCallback()}>{confirmButtonText}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmModal
