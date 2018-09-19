import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { TextField, Button } from '@material-ui/core';

export default class EntryDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.opened}
        onClose={e => this.props.handleClose(false, null)}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        <DialogTitle>Kirjauksen muokkaus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tässä näkymässä voit luoda uusia kirjauksia tai muokata olemassa olevia kirjauksia.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="text"
            label="Kirjauksen teksti"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => this.props.handleClose(false, null)}>
            Peruuta
          </Button>
          <Button onClick={e => this.props.handleClose(false, null)}>
            Lisää kirjaus
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}