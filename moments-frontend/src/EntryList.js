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
      sortAscending: false,
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
  }

  handleSearchChange(tags, startDate, endDate) {
    this.setState({
      searchTags: tags,
      searchStartDate: startDate,
      searchEndDate: endDate
    })
  }

  handleSortChange(event) {
    this.setState({sortAscending: event.target.checked})
  }

  render() {
    let progressIndicator = null
    let entryCards = null
    let entries = this.props.allEntries.slice()

    if (this.props.fetchingEntries) {
      progressIndicator = <CircularProgress size={50} />
    }

    if (this.props.allEntries != null) {
      if (this.state.sortAscending) {
        entries = entries.reverse()
      }

      // If tags have been entered into search bar, or if search dates
      // have been specified, filter cards based on search tags.
      if (this.state.searchTags.length > 0 || this.state.searchStartDate != null || this.state.searchEndDate != null) {
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

      // Paginate results
      entries = entries.slice(this.state.entryIndexStart, this.state.entryIndexStart + this.state.entriesVisible)
      entryCards = entries.map((e) => <Entry key={e.id} entry={e} />)
    }

    return (
      <Fragment>
        <SearchBar
          tags={this.props.tags}
          handleSearchChange={this.handleSearchChange}
          searchStartDate={this.state.searchStartDate}
          searchEndDate={this.state.searchEndDate}
          handleSortChange={this.handleSortChange}
        />
        {progressIndicator}
        {entryCards}
      </Fragment>
    )
  }
}