/*
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Flatpickr from 'react-flatpickr';

class App extends Component {
  state = {
    v: '2016-01-01 01:01',
    onChange: (_, str) => {
      console.info(str)
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState(state => ({
        v: state.v.replace('2016', '2017'),
        onChange: (_, str) => {
          console.info('New change handler: ', str)
        }
      }))
    }, 2000)
  }

  render() {
    const { v } = this.state

    return (
      <main>
        <Flatpickr data-enable-time className='test'
          onChange={(_, str) => console.info(str)} />
        <Flatpickr data-enable-time defaultValue='2016-11-11 11:11'
          onChange={(_, str) => console.info(str)} />
        <Flatpickr data-enable-time value={v}
          onChange={(_, str) => console.info(str)} />
        <Flatpickr value={v} options={{minDate: '2016-11-01'}}
          onChange={(_, str) => console.info(str)} />
        <Flatpickr value={[v, '2016-01-10']} options={{mode: 'range'}}
          onChange={(_, str) => console.info(str)} />
        <Flatpickr onChange={this.state.onChange}
          onOpen={() => { console.info('opened (by prop)') }}
          options={{
            onClose: () => {
              console.info('closed (by option)')
            },
            maxDate: new Date()
          }} />
        <Flatpickr value={new Date()}
          onChange={(_, str) => console.info(str)} />
        <Flatpickr value={v} options={{wrap: true}}
          onChange={(_, str) => console.info(str)}
        >
          <input type='text' data-input />
          <button type='button' data-toggle>Toggle</button>
          <button type='button' data-clear>Clear</button>
        </Flatpickr>
      </main>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
*/

import React from 'react';
import ReactDOM from 'react-dom';

import FlatPickr from 'react-flatpickr';
//import './flatpickr_material_red.css'
import 'flatpickr/dist/themes/material_red.css'

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    const currentDate = new Date();
    const flatPickrOptions = {
      altFormat: 'd.m.Y',
      enableTime: false,
      altInput: true,
      time_24hr: true,
      weekNumbers: true,
    }

    this.state = {
      flatPickrOptions: flatPickrOptions,
      dateGranularity: "day",
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
    }

    this.handleGranularityChange = this.handleGranularityChange.bind(this);
  }

  handleGranularityChange(e) {
    const granularity = e.target.value;
    let flatPickrOptions;
    
    switch (granularity) {
      case 'year':
        flatPickrOptions = {
          altFormat: 'Y',
          enableTime: false,
        }; break;
      case 'month':
        flatPickrOptions = {
          altFormat: 'm/Y',
          enableTime: false,
        }; break;
      case 'day':
        flatPickrOptions = {
          altFormat: 'd.m.Y',
          enableTime: false,
        }; break;
      case 'hour':
        flatPickrOptions = {
          altFormat: 'd.m.Y H:xx',
          enableTime: true,
        }; break;
      case 'minute':
      default:
        flatPickrOptions = {
          altFormat: 'd.m.Y H:i',
          enableTime: true,
        }; break;
    }

    this.setState({
      flatPickrOptions: flatPickrOptions,
      dateGranularity: granularity,
    });    
  }

  handleDateTimeChange(date, dateStr) {    
    console.log(date);
    console.log(dateStr);
    switch (this.state.granularity) {
      case 'year':
        break;
      case 'month':
        break;
      case 'day':
        break;
      case 'hour':
        break;
      case 'minute':
      default:
        break;
    }
   this.setState({year: 2084})
    console.info("Date/time changed.");
    console.info(typeof(date));
    console.info(date);
  }

  render() {
    console.info(this.state);

    return (
      <div className="date-picker">
        <select
          onChange={this.handleGranularityChange}
          value={this.state.dateGranularity}
        >
          <option value="year">Valitse vain vuosi</option>
          <option value="month">Valitse vuosi ja kuukausi</option>
          <option value="day">Valitse päivämäärä</option>
          <option value="hour">Valitse päivämäärä ja tunti</option>
          <option value="minute">Valitse päivämäärä ja aika</option>
        </select>
        <FlatPickr data-enable-time
          //value={this.state.year}
          options={this.state.flatPickrOptions}
          onClose={(date, dateStr) => this.handleDateTimeChange(date, dateStr)}
        />
      </div>
    )
  }
}

class Moments extends React.Component {
  render() {
    return (
      <DatePicker />
    )
  }
}

ReactDOM.render(<Moments />, document.getElementById('root'));
