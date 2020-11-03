
import React from 'react'
import TextField from '@material-ui/core'

import FlatPickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_red.css'

class DatePicker extends React.Component {
    constructor(props) {
      super(props);
  
      this.flatPickrOptions = {
        altFormat: 'd.m.Y',
        enableTime: false,
        altInput: true,
        weekNumbers: true,
      }
  
      this.state = {
        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
      }
  
      this.handleDateTimeChange = this.handleDateTimeChange.bind(this)
      this.handleInputChange = this.handleInputChange.bind(this)
    }
  
    handleDateTimeChange(dates, dateStr) {
      const date = dates.shift()
  
      if (date === undefined) {
        return
      }
      
      let newState = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      }
  
      this.setState(newState)
    }
  
    handleInputChange(inputName, value) {
  
    }
  
    render() {
      console.info("State: ")
      console.info(this.state)
  
      return (
        <div className="date-picker">
          <FlatPickr
            options={this.flatPickrOptions}
            onChange={(date, dateStr) => this.handleDateTimeChange(date, dateStr)}
          />
          <TextField id="month" label="month" helperText="Kuukausi" />
          <ul>
            <li>Year: {this.state.year}</li>
            <li>Month: {this.state.month}</li>
            <li>Day: {this.state.day}</li>
            <li>Hour: {this.state.hour}</li>
            <li>Minute: {this.state.minute}</li>
          </ul>
        </div>
      )
    }
  }
  