import React, { Fragment } from 'react'
import { CircularProgress } from '@material-ui/core';

import Entry from './Entry'
import SearchBar from './SearchBar'

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entryIndexStart: 0,
      entriesVisible: 50,

      searchTags: [],
      searchStartDate: null,
      searchEndDate: null,
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

      // If tags have been entered into search bar, or if search dates
      // have been specified, filter cards based on search tags.
      if (this.state.searchTags.length > 0 || this.state.searchStartDate != null || this.state.searchEndDate != null) {
        entries = this.props.allEntries
        let startDate = this.state.searchStartDate
        let endDate = this.state.searchEndDate

        if (startDate != null) {
          entries = entries.filter((e) => {
            return e.timestamp >= startDate
          })
        }
        if (endDate != null) {
          entries = entries.filter((e) => {
            return e.timestamp <= endDate
          })
        }
        if (this.state.searchTags.length > 0) {
          entries = entries.filter((e) => {
            return this.state.searchTags.every((tag) => e.tags.includes(tag))
          })
        }
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