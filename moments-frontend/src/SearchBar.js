import React from 'react'

import { Chip, Paper } from '@material-ui/core';
import DatePicker from 'react-date-picker'
import AutoComplete from './AutoComplete';

const selectStyle = {
  control: styles => ({...styles, fontFamily: 'Roboto'}),
  option: styles => ({...styles, fontFamily: 'Roboto'})
}

const searchBarStyle = {
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 10,
  marginLeft: 5,
  marginRight: 5,
}

const datePickerStyles = {
  marginTop: 8,
  display: "flex"
}

const sortStyle = {
  marginLeft: -3,
}

const tagStyle = {
  marginRight: 5,
  marginTop: 5,
}

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTags: [],
      startDate: null,
      endDate: null
    }

    this.handleTagChange = this.handleTagChange.bind(this)
    this.handleTagInsert = this.handleTagInsert.bind(this)
    this.handleTagRemove = this.handleTagRemove.bind(this)
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.removeLastTag = this.removeLastTag.bind(this)
  }

  
  handleStartDateChange(date) {
    this.setState({startDate: date})
    this.props.handleSearchChange(this.state.searchTags, date, this.state.endDate)
  }

  handleEndDateChange(date) {
    this.setState({endDate: date})
    this.props.handleSearchChange(this.state.searchTags, this.state.startDate, date)
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
    this.props.handleSearchChange(tags, this.state.startDate, this.state.endDate)
  }

  removeLastTag() {
    let tags = this.state.searchTags
    tags.pop()

    this.handleTagChange(tags)
  }

  render() {
    let tags = this.state.searchTags.map(tag => {
      return <Chip key={tag} label={tag} onDelete={e => this.handleTagRemove(tag) } style={tagStyle} />
    })

    return (
      <Paper style={searchBarStyle}>
        <AutoComplete
            label="Hae kirjauksia tägien perusteella"
            options={this.props.tags}
            optionsFrequencies={this.props.tagsFrequencies}
            threshold={2}
            maxResults={8}
            onOptionSelected={this.handleTagInsert}
            emptyBackspaceFunc={this.removeLastTag}
        />
        {tags}
        <div style={datePickerStyles}>
          <div>
            <DatePicker
              value={this.state.startDate}
              dateFormat="DD.MM.YYYY" 
              isClearable={true}
              onChange={this.handleStartDateChange}
              placeholderText="Alkaen pvm"
              showWeekNumbers
              showYearDropdown
            />
          </div>
          <div style={{marginLeft: 10}}>
            <DatePicker 
              value={this.state.endDate}
              dateFormat="DD.MM.YYYY" 
              isClearable={true}
              onChange={this.handleEndDateChange}
              placeholderText="Päättyen pvm"
              showWeekNumbers
              showYearDropdown
            />
          </div>
        </div>
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