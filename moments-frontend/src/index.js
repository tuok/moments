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
      fetchingEntries: false,
      entries: null,
      errorMessage: null,
    }
  }

  componentDidMount() {
    this.setState({fetchingEntries: true})
    fetch('http://localhost:5000/api/entries')
      .then(response => response.json())
      .then(data => this.setState({
        entries: data,
        fetchingEntries: false
      }))
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
        />
        <EntryDialog />
        <Snackbar
          open={this.state.errorMessage}
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
