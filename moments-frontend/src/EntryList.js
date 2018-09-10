import React, { Fragment } from 'react'
import { CircularProgress } from '@material-ui/core';

import Entry from './Entry'
import SearchBar from './SearchBar'

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTags: [],
      searchStartDate: null,
      searchEndDate: null
    }

    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onSearchChange(tags, startDate, endDate) {
    this.setState({
      searchTags: tags,
      searchStartDate: startDate,
      searchEndDate: endDate
    })
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
        <SearchBar
          tags={this.props.tags}
          onSearchChange={this.onSearchChange}
          searchStartDate={this.state.searchStartDate}
          searchEndDate={this.state.searchEndDate}
        />
        {progressIndicator}
        {entryCards}
      </Fragment>
    )
  }
}