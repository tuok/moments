import 'typeface-roboto'
import './global.css'

import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Layout from './Layout'
import EntryDialog from './EntryDialog'
import EntryList from './EntryList'
import { Snackbar, Button } from '@material-ui/core';
import { Api } from './Utils'

export default class Moments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      authenticated: false,
      fetchingEntries: false,
      fetchingTags: false,
      allTags: [],
      allEntries: [],
      message: null,
      entryDialogVisible: false,
      entryDialogEntry: null,
      selectedEntry: null,
      entriesFetched: false,
      tagsFetched: false,
    }

    this.openEntryDialog = this.openEntryDialog.bind(this)
    this.closeEntryDialog = this.closeEntryDialog.bind(this)
    this.handleEntryMod = this.handleEntryMod.bind(this)
    this.insertEntry = this.insertEntry.bind(this)
    this.initialize = this.initialize.bind(this)
    this.setUser = this.setUser.bind(this)
    this.setPass = this.setPass.bind(this)
  }

  initialize() {
    this.setState({
      fetchingEntries: true,
      fetchingTags: true
    })

    Api.getTags()
    .then(result => {
      if (result.ok) {
        this.setState({
          allTagsFrequencies: result.data.tagsFrequencies,
          allTags: result.data.tags,
          tagsFetched: true,
          })
        } else {
        this.setState({message: result.data})
      }
      this.setState({fetchingTags: false})
    })

    Api.getEntries()
    .then(result => {
      if (result.ok) {
        this.setState({
          allEntries: result.data,
          entriesFetched: true,
        })
      } else {
        this.setState({message: result.data})
      }
      this.setState({fetchingEntries: false})
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

  handleEntryMod(entry) {
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

  insertEntry(entry) {
    Api.insertEntry(entry)
    .then(result => {
      // Abort if entry couldn't be added
      if (!result.ok) {
        return
      }

      let addedEntry = result.data

      // Convert string timestamp to native timestamp
      addedEntry.start_time = new Date(addedEntry.start_time)

      let entries = null

      if (this.state.allEntries.length > 0) {
        // Find index where new entry should be added among old entries
        let i = 0
        while (addedEntry.start_time < this.state.allEntries[i].start_time) {
          if (i >= this.state.allEntries.length - 1) {
            i++
            break
          }
          i++
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

  setUser(val) {
    this.setState({ username: val})
    Api.username = val
  }

  setPass(val) {
    this.setState({ password: val})
    Api.password = val
  }

  render() {
    return (
      <Fragment>
        <Layout
          handleNewEntryClick={this.openEntryDialog}
          newEntryButtonEnabled={this.state.entriesFetched && this.state.tagsFetched}
          fetchData={this.initialize}
          setUser={this.setUser}
          setPass={this.setPass}
        />
        {this.state.entriesFetched && this.state.tagsFetched ?
          <EntryList
            tags={this.state.allTags}
            tagsFrequencies={this.state.allTagsFrequencies}
            fetchingData={this.state.fetchingEntries || this.state.fetchingTags}
            allEntries={this.state.allEntries}
            visibleEntries={this.state.visibleEntries}
          /> : null}
        {this.state.entryDialogVisible ?
          <EntryDialog
            tags={this.state.allTags}
            tagsFrequencies={this.state.allTagsFrequencies}
            opened={this.state.entryDialogVisible}
            handleEntryMod={this.handleEntryMod}
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
            </Button>
          ]}
        />
      </Fragment>
    )
  }
}

ReactDOM.render(<Moments />, document.getElementById('root'))
