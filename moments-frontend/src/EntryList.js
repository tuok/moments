import React, { Fragment } from 'react'
import { CircularProgress } from '@material-ui/core';

import Entry from './Entry'
import SearchBar from './SearchBar'

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTags: []
    }

    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onSearchChange(tags) {
    this.setState({searchTags: tags})
  }

  render() {
    let progressIndicator = null
    let entryCards = null

    if (this.props.fetchingEntries) {
      progressIndicator = <CircularProgress size={50} />
    }

    if (this.props.allEntries != null && this.props.visibleEntries != null) {
      let entries = this.props.visibleEntries;

      // If tags have been entered into search bar, filter cards based on search tags
      if (this.state.searchTags.length > 0) {
        entries = this.props.allEntries.filter((e) => {
          return this.state.searchTags.every((tag) => e.tags.includes(tag))
        })
      }

      entryCards = entries.map((e) => <Entry key={e.id} entry={e} />)
    }

    return (
      <Fragment>
        <SearchBar tags={this.props.tags} onSearchChange={this.onSearchChange} />
        {progressIndicator}
        {entryCards}
      </Fragment>
    )
  }
}