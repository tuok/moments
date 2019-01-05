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
      searchTerm: null,
      searchStartDate: null,
      searchEndDate: null,
      sortAscending: false,
    }

    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
  }

  handleSearchChange(fullTextTerm, tags, startDate, endDate) {
    this.setState({
      searchTerm: fullTextTerm,
      searchTags: tags,
      searchStartDate: startDate,
      searchEndDate: endDate
    })
  }

  handleSortChange(event) {
    this.setState({sortAscending: event.target.checked})
  }

  getFilteredEntries() {
    let entries = this.props.allEntries.slice()

    if (this.props.allEntries != null) {
      if (this.state.sortAscending) {
        entries = entries.reverse()
      }

      // If tags have been entered into search bar, or if search dates
      // have been specified, of if full text search term has been specified, filter entries based on search terms.
      if (this.state.searchTags.length > 0 ||
          this.state.searchStartDate != null ||
          this.state.searchEndDate != null ||
          this.state.searchTerm != null) {
        let startDate = this.state.searchStartDate
        let endDate = this.state.searchEndDate
        let term = this.state.searchTerm

        if (startDate != null) {
          entries = entries.filter((e) => {
            return e.start_time >= startDate
          })
        }

        if (endDate != null) {
          entries = entries.filter((e) => {
            return e.start_time <= endDate
          })
        }

        if (this.state.searchTags.length > 0) {
          entries = entries.filter((e) => {
            return this.state.searchTags.every((tag) => e.tags.includes(tag))
          })
        }

        if (term !== null) {
          entries = entries.filter((e) => {
            return e.text.toLowerCase().includes(term)
          })
        }
      }

      // Paginate ans return results
      return entries.slice(this.state.entryIndexStart, this.state.entryIndexStart + this.state.entriesVisible)
    }
  }

  render() {
    let progressIndicator = null

    if (this.props.fetchingData) {
      progressIndicator = <CircularProgress size={50} />
    }

    let entries = this.getFilteredEntries()
    let entryCards = entries.map((e) => <Entry key={e.id} entry={e} />)

    return (
      <Fragment>
        <SearchBar
          tags={this.props.tags}
          tagsFrequencies={this.props.tagsFrequencies}
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