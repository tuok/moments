import 'typeface-roboto'

import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Layout from './Layout'
import EntryDialog from './EntryDialog'
import EntryList from './EntryList'

export default class Moments extends React.Component {
  render() {
    return (
      <Fragment>
        <Layout />
        <EntryList />
        <EntryDialog />
      </Fragment>
    )
  }
}

ReactDOM.render(<Moments />, document.getElementById('root'))
