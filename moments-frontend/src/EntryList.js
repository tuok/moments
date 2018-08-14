import React, { Fragment } from 'react'
import { CircularProgress, Card, CardContent, Typography } from '@material-ui/core';

const entryCardStyle = {
  marginTop: 10,
  marginLeft: 5,
  marginRight: 5,
}

export default class EntryList extends React.Component {
  constructor(props) {
    super(props)
  }

  formatDateFromComponents(components) {

  }

  singleEntry(entry) {
    return (
      <Card key={entry.id} style={entryCardStyle}>
        <CardContent>
          <Typography variant="title" className="card-title">
            #{entry.id}
          </Typography>
          <Typography style={{display: 'inline-block'}} variant="caption" className="card-text">
            #{entry.text}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  render() {
    console.info("EntryList props: ")
    console.info(this.props)

    let progressIndicator = null
    let entryCards = null

    if (this.props.fetchingEntries) {
      progressIndicator = <CircularProgress size={50} />
    }

    if (this.props.entries != null) {
      entryCards = this.props.entries.map((entry) => this.singleEntry(entry))
    }

    return (
      <Fragment>
        {progressIndicator}
        {entryCards}
      </Fragment>
    )
  }
}