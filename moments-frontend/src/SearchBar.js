import React from 'react'

import Select from 'react-select'
import { Typography } from '@material-ui/core';
import DatePicker from 'react-date-picker'

const selectStyle = {
  control: styles => ({...styles, fontFamily: 'Roboto'}),
  option: styles => ({...styles, fontFamily: 'Roboto'})
}

const searchBarStyles = {
  marginLeft: 5,
}

const datePickerStyles = {
  marginTop: 8,
  display: "flex"
}

const sortStyle = {
  marginLeft: -3,
}

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTags: [],
      startDate: null,
      endDate: null
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
  }

  handleSelectChange(selectedTags) {
    let tags = []
    selectedTags.forEach(element => {
      tags.push(element.value)
    });

    this.setState({searchTags: tags})
    this.props.handleSearchChange(tags, this.state.startDate, this.state.endDate)
  }
  
  handleStartDateChange(date) {
    this.setState({startDate: date})
    this.props.handleSearchChange(this.state.searchTags, date, this.state.endDate)
  }

  handleEndDateChange(date) {
    this.setState({endDate: date})
    this.props.handleSearchChange(this.state.searchTags, this.state.startDate, date)
  }

  render() {
    return (
      <div style={searchBarStyles}>
        <Typography variant="subheading">Hae kirjauksista</Typography>
        <Select
          isMulti={true}
          options={this.props.tags}
          styles={selectStyle}
          onChange={this.handleSelectChange}
          placeholder="Hae kirjauksia tägien perusteella"
          openOnClick={true}
        />
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
      </div>
    )
  }
}