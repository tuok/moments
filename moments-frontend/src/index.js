import 'typeface-roboto'

import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Layout from './Layout'
import EntryDialog from './EntryDialog'
import EntryList from './EntryList'
import { Snackbar, Button, IconButton } from '@material-ui/core';
import { CloseIcon } from '@material-ui/icons/Close'

export default class Moments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entryIndexStart: 0,
      entriesVisible: 50,
      fetchingEntries: false,
      entries: null,
      visibleEntries: null,
      errorMessage: null,
    }
  }

  componentDidMount() {
    this.setState({fetchingEntries: true})
    fetch('http://localhost:5000/api/entries')
      .then(response => response.json())
      .then(data => {
        let entries = data.reverse()

        // TODO: Add time formatting here

        this.setState({
          // Reverse entries so that newest is at index 0.
          // This helps entry navigation implementation.
          entries: entries,
          visibleEntries: entries.slice(
            this.state.entryIndexStart,
            this.state.entryIndexStart + this.state.entriesVisible
          ),
          fetchingEntries: false
      })
    })
      .catch(err => {
        console.error(err)
        const msg = 'Tapahtumien haussa palvelimelta tapahtui virhe.'
        this.setState({
          errorMessage: msg,
          fetchingEntries: false
        })
      })
  }

  handleError(err) {
    this.setState({
      fetchingEntries: false,
      errorMessage: err,
    })
}

  handleSnackbarClick = () => {
    this.setState({ errorMessage: null });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ errorMessage: null });
  };


  render() {
    console.log(this.state)
    return (
      <Fragment>
        <Layout />
        <EntryList 
          fetchingEntries={this.state.fetchingEntries}
          entries={this.state.visibleEntries}
        />
        <EntryDialog />
        <Snackbar
          open={this.state.errorMessage != null}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          message={this.state.errorMessage}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.handleSnackbarClose}
            >
              Sulje
            </Button>,
          ]}
        />
      </Fragment>
    )
  }
}

ReactDOM.render(<Moments />, document.getElementById('root'))
