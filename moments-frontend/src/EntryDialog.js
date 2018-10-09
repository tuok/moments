import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { TextField, Button } from '@material-ui/core'

import CreatableSelect from 'react-select'

import AutoComplete from './AutoComplete'

const selectStyle = {
  control: styles => ({...styles, fontFamily: 'Roboto'}),
  option: styles => ({...styles, fontFamily: 'Roboto'})
}

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
            rowsMax="20"
            margin="normal"
            id="text"
            label="Kirjauksen teksti"
            onChange={e => this.handleEntryChange('text', e.target.value)}
          />
          <AutoComplete
            label="Tägit"
            options={this.props.tags}
            optionsFrequencies={this.props.tagsFrequencies}
            threshold={2}
            maxResults={5}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="start_timestamp"
            label="Alkuajankohta"
            onChange={e => this.handleEntryChange('start_timestamp', e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            id="end_timestamp"
            label="Loppuajankohta"
            onChange={e => this.handleEntryChange('end_timestamp', e.target.value)}
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