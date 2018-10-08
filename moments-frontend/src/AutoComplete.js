// TODO: Priorisoi startswith-tulokset ekaksi ja muut vasta sen jälkeen

import React, { Fragment } from 'react'
import { TextField, Paper, Typography, Popover, MenuItem } from '@material-ui/core'

const searchFieldStyle = {
  marginTop: 3
}

export default class AutoComplete extends React.Component {
  constructor(props) {
    super(props)

    this.resetOptions = this.resetOptions.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  state = {
    term: "",
    options: [],
    anchorElement: null,
    selectedIndex: 0
  }

  handleSearchTermChange(target, term) {
    if (term.length >= this.props.threshold) {
      let options = []

      for (let i = 0; i < this.props.options.length; i++) {
        if (this.props.options[i].includes(term)) {
          options.push(this.props.options[i])
        }
        
        if (options.length >= this.props.maxResults) {
          break
        }
      }

      if (options.length > 0) {
        this.setState({
          options: options,
          anchorElement: target,
          selectedIndex: 0,
        })
      }
    }
    else {
      this.resetOptions()
    }

    this.setState({term: term})
  }

  resetOptions(resetTerm = true) {
    let newState = {
      options: [],
      anchorElement: null,
      selectedIndex: 0,
    }

    if (resetTerm) {
      newState.term = ""
    }

    this.setState(newState)
  }

  handleKeyPress(e) {
    // ArrowUp
    if (e.keyCode === 38) {
      let newIndex = this.state.selectedIndex - 1

      if (newIndex < 0) {
        newIndex = this.state.options.length - 1
      }

      this.setState({selectedIndex: this.state.selectedIndex - 1})
    }
    // ArrowDown
    else if (e.keyCode === 40) {
      let newIndex = this.state.selectedIndex + 1

      if (newIndex >= this.state.options.length) {
        newIndex = 0
      }

      this.setState({selectedIndex: newIndex})
    }
    // Enter
    else if (e.keyCode === 13 && this.state.options.length > 0) {
      this.optionSelected(this.state.options[this.state.selectedIndex])
    }
    // Escape
    else if (e.keyCode === 27 && this.state.options.length > 0) {
      this.resetOptions(false)
    }
    // Escape
    else if (e.keyCode === 8 && this.props.emptyBackspaceFunc) {
      this.props.emptyBackspaceFunc()
    }
  }

  optionSelected(option) {
    this.resetOptions()
    this.props.onOptionSelected(option)
  }

  render() {
    const optionTexts = this.state.options.map((opt, i) => {
        return <MenuItem
          key={opt}
          onClick={e => this.optionSelected(opt)}
          onKeyDown={this.handleKeyPress}
          selected={i === this.state.selectedIndex}
        >
          {opt}
        </MenuItem>
    })

    return (
      <Fragment>
        <TextField
          style={searchFieldStyle}
          fullWidth
          margin='normal'
          label={this.props.label}
          onChange={e => this.handleSearchTermChange(e.currentTarget, e.target.value)}
          onKeyDown={this.handleKeyPress}
          value={this.state.term}
        />
        <Popover
          open={Boolean(this.state.anchorElement)}
          anchorEl={this.state.anchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={this.handlePopoverClose}
          onKeyDown={this.handleKeyPress}
          disableAutoFocus={true}
          disableEnforceFocus={true}
        >
          {optionTexts}
        </Popover>
      </Fragment>
    )
  }
}

AutoComplete.defaultProps = {
  emptyBackspaceFunc: null
}