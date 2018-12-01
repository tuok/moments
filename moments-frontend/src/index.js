import 'typeface-roboto'
import './global.css'

import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Layout from './Layout'
import EntryDialog from './EntryDialog'
import EntryList from './EntryList'
import { Snackbar, Button } from '@material-ui/core';

if (process.env.REACT_APP_API_URL === undefined) {
  throw "Environment variable REACT_APP_API_URL must be defined in .env file."
}

const slash = process.env.REACT_APP_API_URL.slice(-1) != '/' ? '/' : ''
const API_URL = process.env.REACT_APP_API_URL + slash

export default class Moments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchingEntries: false,
      fetchingTags: false,
      allTags: [],
      allEntries: [],
      message: null,
      entryDialogVisible: false,
      entryDialogEntry: null,
      selectedEntry: null,
    }

    this.openEntryDialog = this.openEntryDialog.bind(this)
    this.closeEntryDialog = this.closeEntryDialog.bind(this)
    this.handleEntryModification = this.handleEntryModification.bind(this)
    this.insertEntry = this.insertEntry.bind(this)
  }

  componentDidMount() {
    this.setState({
      fetchingEntries: true,
      fetchingTags: true
    })

    fetch(API_URL + 'entries')
      .then(response => response.json())
      .then(data => {
        let entries = data.reverse()

        entries.forEach(e => {
          e.start_time = new Date(e.start_time)
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
          message: msg,
          fetchingEntries: false
        })
      })

    fetch(API_URL + 'tags?frequencies=True')
      .then(response => response.json())
      .then(tagsFrequencies => {
        let tags = Object.keys(tagsFrequencies)
        tags.sort()

        this.setState({
          allTagsFrequencies: tagsFrequencies,
          allTags: tags,
          fetchingTags: false
        })
      })
      .catch(err => {
        console.error(err)
        const msg = 'Tägien haussa palvelimelta tapahtui virhe.'
        this.setState({
          message: msg,
          fetchingTags: false
        })
      })
  }

  handleError(err) {
    this.setState({
      fetchingData: false,
      message: err,
    })
  }

  openEntryDialog(entry) {
    this.setState({
      entryDialogVisible: true,
      selectedEntry: entry,
    })
  }

  closeEntryDialog() {
    this.setState({
      entryDialogVisible: false,
    })
  }

  handleEntryModification(entry) {
    if (entry.entryId) {
      this.updateEntry(entry)
    } else {
      this.insertEntry(entry)
    }
  }

  async updateEntry(entry) {
    this.setState({
      entryDialogVisible: false,
    })
  }

  async insertEntry(entry) {
    // Send new entry to backend
    let addedEntry = await fetch(API_URL + 'entries', {
      headers: { "Content-Type": "application/json" },
      method: 'PUT',
      body: JSON.stringify(entry),
    })
    .then(response => response.json())
    .then(result => result)
    .catch(err => {
      console.error(err)
      this.setState({ message: "Kirjauksen lisäys epäonnistui. Konsolissa lisätietoja." })
    })

    // Abort if entry couldn't be added
    if (!addedEntry) return

    // Convert string timestamp to native timestamp
    addedEntry.start_time = new Date(addedEntry.start_time)

    let entries = null

    if (this.state.allEntries.length > 0) {
      // Browse position, where new entry should be added among old entries
      let i = 0
      while (addedEntry.start_time < this.state.allEntries[i++].start_time) {
        if (i >= this.state.allEntries.length) break
      }

      // Put new entry to correct position
      entries = this.state.allEntries
      entries = entries.slice(0, i).concat(addedEntry, entries.slice(i))
    } else {
      entries = [addedEntry]
    }

    let tags = this.state.allTags.slice()

    // Add new tags to tag list
    addedEntry.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    })

    tags.sort()

    this.setState({
      entryDialogVisible: false,
      allEntries: entries,
      allTags: tags,
      message: "Kirjaus lisätty onnistuneesti!"
    })
  }

  handleSnackbarClick = () => {
    this.setState({ message: null });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      message: null
    });
  };


  render() {
    return (
      <Fragment>
        <Layout
          handleNewEntryClick={this.openEntryDialog}
        />
        <EntryList
          tags={this.state.allTags}
          tagsFrequencies={this.state.allTagsFrequencies}
          fetchingEntries={this.state.fetchingData}
          allEntries={this.state.allEntries}
          visibleEntries={this.state.visibleEntries}
        />
        {this.state.entryDialogVisible ?
          <EntryDialog
            tags={this.state.allTags}
            tagsFrequencies={this.state.allTagsFrequencies}
            opened={this.state.entryDialogVisible}
            handleEntry={this.handleEntryModification}
            handleClose={this.closeEntryDialog}
            entry={this.state.entryDialogEntry}
          /> : null}
        <Snackbar
          open={this.state.message != null}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          message={this.state.message}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.handleSnackbarClose}
            >
              OK
            </Button>,
          ]}
        />
      </Fragment>
    )
  }
}

ReactDOM.render(<Moments />, document.getElementById('root'))
