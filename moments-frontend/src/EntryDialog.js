import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

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
      >
        <DialogTitle>Kirjauksen muokkaus</DialogTitle>
      </Dialog>
    )
  }
}