import React from 'react'

import { Chip, Paper, TextField } from '@material-ui/core';
import AutoComplete from './AutoComplete';
import { getTimeComponentsFromTimestamp, getDateFromTimeComponents }from './Utils';

const searchBarStyle = {
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 10,
  marginLeft: 5,
  marginRight: 5,
}

const fullTextSearchStyle = {

}

const datePickerStyle = {
  marginRight: 8,
}

const sortStyle = {
  marginLeft: -3,
}

const tagStyle = {
  marginRight: 5,
  marginTop: 5,
  marginBottom: 5,
}

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTags: [],
      fullTextSearchTerm: null,
      startDate: null,
      endDate: null
    }

    this.handleFullTextSearchTermChange = this.handleFullTextSearchTermChange.bind(this)
    this.handleTagChange = this.handleTagChange.bind(this)
    this.handleTagInsert = this.handleTagInsert.bind(this)
    this.handleTagRemove = this.handleTagRemove.bind(this)
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.removeLastTag = this.removeLastTag.bind(this)
  }

  handleFullTextSearchTermChange(term) {
    if (term.length >= 3) {
      this.setState({fullTextSearchTerm: term})
      this.props.handleSearchChange(term, this.state.searchTags, this.state.startDate, this.state.endDate)
    } else if (this.state.fullTextSearchTerm !== null) {
      this.setState({startDate: null})
      this.props.handleSearchChange(null, this.state.searchTags, this.state.startDate, this.state.endDate)
    }
  }
  
  handleStartDateChange(date) {
    let components = getTimeComponentsFromTimestamp(date)

    if (components !== false) {
      let dt = getDateFromTimeComponents(components)
      this.setState({startDate: dt})
      this.props.handleSearchChange(this.state.fullTextSearchTerm, this.state.searchTags, dt, this.state.endDate)
    } else if (this.state.startDate !== null) {
      this.setState({startDate: null})
      this.props.handleSearchChange(this.state.fullTextSearchTerm, this.state.searchTags, null, this.state.endDate)
    }
  }

  handleEndDateChange(date) {
    let components = getTimeComponentsFromTimestamp(date)

    if (components !== false) {
      let dt = getDateFromTimeComponents(components)
      this.setState({endDate: dt})
      this.props.handleSearchChange(this.state.fullTextSearchTerm, this.state.searchTags, this.state.startDate, dt)
    } else if (this.state.endDate !== null) {
      this.setState({endDate: null})
      this.props.handleSearchChange(this.state.fullTextSearchTerm, this.state.searchTags, this.state.endDate, null)
    }
  }

  handleTagInsert(tag) {
    let tags = this.state.searchTags.slice()
    tags.push(tag)

    this.handleTagChange(tags)
  }

  handleTagRemove(tag) {
    let tags = this.state.searchTags.filter(t => t !== tag)

    this.handleTagChange(tags)
  }

  handleTagChange(tags) {
    this.setState({searchTags: tags})
    this.props.handleSearchChange(this.state.fullTextSearchTerm, tags, this.state.startDate, this.state.endDate)
  }

  removeLastTag() {
    let tags = this.state.searchTags.slice()
    tags.pop()

    this.handleTagChange(tags)
  }

  render() {
    const tags = this.state.searchTags.map(tag => {
      return <Chip key={tag} label={tag} onDelete={e => this.handleTagRemove(tag) } style={tagStyle} />
    })

    return (
      <Paper style={searchBarStyle}>
        <AutoComplete
            label="Hae kirjauksia tägien perusteella"
            options={this.props.tags}
            optionsFrequencies={this.props.tagsFrequencies}
            threshold={2}
            maxResults={5}
            onOptionSelected={this.handleTagInsert}
            emptyBackspaceFunc={this.removeLastTag}
        />
        {tags}
        <TextField
          id="fullTextSearch"
          label="Hae kirjauksia merkkijonon perusteella"
          fullWidth={true}
          style={fullTextSearchStyle}
          onChange={e => this.handleFullTextSearchTermChange(e.target.value)}
        />
        <TextField
          id="startTimestamp"
          label="Alkaen pvm"
          style={datePickerStyle}
          onChange={e => this.handleStartDateChange(e.target.value)}
        />
        <TextField
          id="endTimestamp"
          label="Päättyen pvm"
          style={datePickerStyle}
          onChange={e => this.handleEndDateChange(e.target.value)}
        />
        <label style={sortStyle}>
          <input
            type="checkbox"
            defaultChecked={false}
            value={this.props.sortAscending}
            onChange={this.props.handleSortChange}
          />
          Järjestä vanhimmasta uusimpaan
        </label>
      </Paper>
    )
  }
}