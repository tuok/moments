import React, { Fragment } from 'react'
import { CircularProgress } from '@material-ui/core';

import Entry from './Entry'
import SearchBar from './SearchBar'

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let progressIndicator = null
    let entryCards = null

    if (this.props.fetchingEntries) {
      progressIndicator = <CircularProgress size={50} />
    }

    if (this.props.entries != null) {
      entryCards = this.props.entries.map((e) => <Entry key={e.id} entry={e} />)
    }

    return (
      <Fragment>
        <SearchBar />
        {progressIndicator}
        {entryCards}
      </Fragment>
    )
  }
}