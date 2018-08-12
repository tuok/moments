import React, { Fragment } from 'react'
import { CircularProgress } from '@material-ui/core';

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <Fragment>
        {this.props.fetchingEntries ? <CircularProgress size={50} /> : null }
        <p>Hello from EntryList!</p>
      </Fragment>
    )
  }
}