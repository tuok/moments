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

    this.onSelectChange = this.onSelectChange.bind(this)
  }

  onSelectChange(selectedTags) {
    let tags = []
    selectedTags.forEach(element => {
      tags.push(element.value)
    });

    this.props.onSearchChange(tags)
  }

  render() {
    const tagOptions = this.props.tags.map(t => {
      return { value: t, label: t }
    })

    const tagFilterOptions = createFilterOptions({tagOptions})

    return (
      <div style={searchBarStyles}>
        <Typography variant="subheading">Hae kirjauksia tägien perusteella:</Typography>
        <Select
          isMulti={true}
          options={tagOptions}
          styles={selectStyle}
          onChange={this.onSelectChange}
          placeholder="Hae tägejä..."
          openOnClick={true}
        />
      </div>
    )
  }
}