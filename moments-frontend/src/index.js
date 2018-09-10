/*
TODO:
- Optimoi react-select, on nyt aika hidas isolla määrällä tägejä.
*/

import 'typeface-roboto'
import './global.css'

import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Layout from './Layout'
import EntryDialog from './EntryDialog'
import EntryList from './EntryList'
import { Snackbar, Button } from '@material-ui/core';

export default class Moments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchingEntries: false,
      fetchingTags: false,
      allTags: [],
      allEntries: [],
      errorMessage: null,
    }
  }

  componentDidMount() {
    this.setState({
      fetchingEntries: true,
      fetchingTags: true
    })

    fetch('http://localhost:5000/api/entries')
      .then(response => response.json())
      .then(data => {
        let entries = data.reverse()

        entries.forEach(e => {
          e.timestamp = new Date(e.timestamp)
        })

        // TODO: Add time formatting here

        this.setState({
          // Reverse entries so that newest is at index 0.
          // This helps entry navigation implementation.
          allEntries: entries,
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

    fetch('http://localhost:5000/api/tags')
      .then(response => response.json())
      .then(data => {
        const tagOptions = data.map(t => {
          return { value: t, label: t }
        })

        this.setState({
          allTags: data,
          allTagOptions: tagOptions,
          fetchingTags: false
        })
      })
      .catch(err => {
        console.error(err)
        const msg = 'Tägien haussa palvelimelta tapahtui virhe.'
        this.setState({
          errorMessage: msg,
          fetchingTags: false
        })
      })

  }

  handleError(err) {
    this.setState({
      fetchingData: false,
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
    return (
      <Fragment>
        <Layout />
        <EntryList
          tags={this.state.allTagOptions}
          fetchingData={this.state.fetchingData}
          allEntries={this.state.allEntries}
          visibleEntries={this.state.visibleEntries}
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
