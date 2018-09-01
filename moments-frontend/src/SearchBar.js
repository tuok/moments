import React from 'react'

import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const customStyles = {
  control: styles => ({...styles, fontFamily: 'Roboto'}),
  option: styles => ({...styles, fontFamily: 'Roboto'})
}

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Select isMulti={true} options={options} styles={customStyles} />
    )
  }
}