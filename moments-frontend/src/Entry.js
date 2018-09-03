import React from 'react'
import { Card, CardContent, Chip, Divider, Typography } from '@material-ui/core';


const entryCardStyle = {
  marginTop: 10,
  marginLeft: 5,
  marginRight: 5,
}

const entryCardTitleStyle = {
  marginBottom: 10,
}

const entryCardTextStyle = {
  whiteSpace: 'pre-line',
  marginBottom: 15,
}

const tagStyle = {
  marginRight: 5,
  marginTop: 5,
}

const tagTitleStyle = {
  fontWeight: "bold",
  marginBottom: 0,
}


export default class Entry extends React.Component {
  constructor(props) {
    super(props)
  }

  formatDateFromComponents(times) {
    let readable_timestamp = ''

    // Default separator if only month and year have been defined
    let separator = '/'

    // Handle year
    if (times[0]) {
      readable_timestamp = times[0].toString()
    }

    // Handle month
    if (times[1]) {
      // Check if day is defined so that we can display "month/year" or "day.month.year"
      if (times[2]) {
        // Day is defined
        separator = '.'
      }

      // 2018 -> 03/2018 or 03.2018
      readable_timestamp =
        times[1].toString().padStart(2, '0') +
        separator +
        readable_timestamp
    }

    // If day of month is defined
    if (times[2]) {
      // 03.2018 -> 23.03.2018
      readable_timestamp =
        times[2].toString().padStart(2, '0') +
        separator +
        readable_timestamp

      // If hour is defined
      if (times[3]) {
        // 23.03.2018 -> 23.03.2018 06:
        readable_timestamp += ` ${times[3].toString().padStart(2, '0')}:`
        // 23.03.2018 06: -> 23.03.2018 06:xx or 23.03.2018 06:41
        readable_timestamp += times[4] ? times[4].toString().padStart(2, '0') : 'xx'
      }
    }

    return readable_timestamp
  }

  render() {
    let entry = this.props.entry
    let tags = this.props.entry.tags.map(t => <Chip key={t} label={t} style={tagStyle} />)

    return (
      <Card key={entry.id} style={entryCardStyle}>
        <CardContent>
          <Typography variant="title" style={entryCardTitleStyle}>
            {this.formatDateFromComponents(entry.time_components)}
          </Typography>
          <Typography style={entryCardTextStyle} component="p">
              {entry.text}
          </Typography>
          <Typography variant="subheading" style={tagTitleStyle}>Tägit</Typography>
          {tags}
          
          
        </CardContent>
      </Card>
    )
  }
}