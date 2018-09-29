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

  handleEntryChange(name, val) {
    console.log(name + " changed to: " + val)
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
            fullWidth
            margin="normal"
            id="title"
            label="Kirjauksen otsikko"
            onChange={e => this.handleEntryChange('title', e.target.value)}
          />
          <TextField
            required
            fullWidth
            multiline
            rowsMax="6"
            margin="normal"
            id="text"
            label="Kirjauksen teksti"
            onChange={e => this.handleEntryChange('text', e.target.value)}
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