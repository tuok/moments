import React from 'react'

import Select from 'react-select'
import { Typography } from '@material-ui/core';

const selectStyle = {
  control: styles => ({...styles, fontFamily: 'Roboto'}),
  option: styles => ({...styles, fontFamily: 'Roboto'})
}

const searchBarStyles = {
  marginLeft: 5,
}

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTags: [],
      allTagOptions: [],
    }

    this.onSelectChange = this.onSelectChange.bind(this)
  }

  onSelectChange(selectedTags) {
    let tags = []
    selectedTags.forEach(element => {
      tags.push(element.value)
    });

    this.setState({searchTags: tags})
  }

  render() {
    let tagOptions = this.props.tags.map(t => {
      return { value: t, label: t }
    })

    console.log("render")

    return (
      <div style={searchBarStyles}>
        <Typography variant="subheading">Hae kirjauksia tägien perusteella:</Typography>
        <Select isMulti={true} options={tagOptions} styles={selectStyle} onChange={this.onSelectChange} />
      </div>
    )
  }
}