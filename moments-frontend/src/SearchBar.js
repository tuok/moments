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

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTags: [],
      startDate: null,
      endDate: null
    }

    this.onSelectChange = this.onSelectChange.bind(this)
    this.onStartDateChange = this.onStartDateChange.bind(this)
    this.onEndDateChange = this.onEndDateChange.bind(this)
  }

  onSelectChange(selectedTags) {
    console.log("onSelectChange")
    let tags = []
    selectedTags.forEach(element => {
      tags.push(element.value)
    });

    this.setState({searchTags: tags})
    this.props.onSearchChange(tags, this.state.startDate, this.state.endDate)
  }
  
  onStartDateChange(date) {
    console.log("onStartDateChange")
    //console.log("Start date: " + date.toString())
    this.setState({startDate: date})
    this.props.onSearchChange(this.state.searchTags, date, this.state.endDate)
  }

  onEndDateChange(date) {
    console.log("onEndDateChange")
    //console.log("End date: " + date.toString())
    this.setState({endDate: date})
    this.props.onSearchChange(this.state.searchTags, this.state.startDate, date)
  }

  render() {
    console.log("Searchbar Render")
    return (
      <div style={searchBarStyles}>
        <Typography variant="subheading">Hae kirjauksista</Typography>
        <Select
          isMulti={true}
          options={this.props.tags}
          styles={selectStyle}
          onChange={this.onSelectChange}
          placeholder="Hae kirjauksia tägien perusteella"
          openOnClick={true}
        />
        <div style={datePickerStyles}>
          <div>
            <DatePicker
              value={this.state.startDate}
              dateFormat="DD.MM.YYYY" 
              isClearable={true}
              onChange={this.onStartDateChange}
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
              onChange={this.onEndDateChange}
              placeholderText="Päättyen pvm"
              showWeekNumbers
              showYearDropdown
            />
          </div>
        </div>
      </div>
    )
  }
}