import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Button, Typography } from '@mui/material'

import { IEntry } from './Models'
import Api from './Api'

export interface IDeleteModalProps {
    entry: IEntry
    handleCancel: Function
    handleEntryModified: Function
}

const DeleteModal = (props: IDeleteModalProps) => {
    const { entry, handleCancel, handleEntryModified } = props

    return (
        <Dialog
            open={true}
            onClose={(e) => handleCancel()}
            /*disableBackdropClick={false}*/ disableEscapeKeyDown={false}
        >
            <DialogTitle>Vahvista poisto</DialogTitle>
            <DialogContent
                style={{ marginTop: 10, marginBottom: 10, marginRight: 80 }}
            >
                <Typography variant="body1">
                    Poistetaanko kirjaus #{entry.id}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => handleCancel()}>Peruuta</Button>
                <Button
                    onClick={(e) =>
                        Api.removeEntry(entry, () => {
                            console.info('Entry removed successfully!')
                            handleEntryModified([], entry.tags)
                            handleCancel()
                        })
                    }
                >
                    Poista kirjaus
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteModal
