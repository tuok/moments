import React, { Fragment } from 'react'
import { TextField, Paper, Popper, MenuItem } from '@material-ui/core'

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

  async searchTags(target, term) {
    if (term.length >= this.props.threshold) {
      let options = []

      for (let i = 0; i < this.props.options.length; i++) {
        if (this.props.options[i].includes(term)) {
          options.push(this.props.options[i])
        }
      }

      options.sort((a, b) => {
        let aIdx = a.indexOf(term)
        let bIdx = b.indexOf(term)

        // First compare search term location in tag
        if (aIdx < bIdx) return -1
        if (aIdx > bIdx) return 1

        let aFreq = this.props.optionsFrequencies[a]
        let bFreq = this.props.optionsFrequencies[b]

        // If term location is same, compare tag frequencies
        if (aFreq < bFreq) return 1
        if (aFreq > bFreq) return -1

        return 0
      })

      if (options.length > 0) {
        this.setState({
          options: options.slice(0, this.props.maxResults + 1),
          anchorElement: target,
          selectedIndex: 0,
        })
      }
    }
    else {
      this.resetOptions()
    }
  }

  handleSearchTermChange(target, term) {
    this.searchTags(target, term)
    this.setState({term: term})
  }

  resetOptions(resetTerm = true) {
    if (resetTerm) {
      this.setState({term: ""})
    }

    this.resetOptionsAsync()
  }

  async resetOptionsAsync() {
    this.setState({
      options: [],
      anchorElement: null,
      selectedIndex: 0,
    })
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
    else if (e.keyCode === 13) {
      if (this.state.options.length > 0) {
        this.optionSelected(this.state.options[this.state.selectedIndex])
      } else {
        this.optionSelected(this.state.term)
      }
    }
    // Escape
    else if (e.keyCode === 27 && this.state.options.length > 0) {
      this.resetOptions(false)
    }
    // Backspace
    else if (e.keyCode === 8 && this.props.emptyBackspaceFunc && this.state.term.length < 1) {
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
        <Popper
          open={Boolean(this.state.anchorElement)}
          anchorEl={this.state.anchorElement}
          placement='bottom-start'
        >
          <Paper>{optionTexts}</Paper>
        </Popper>
      </Fragment>
    )
  }
}

AutoComplete.defaultProps = {
  emptyBackspaceFunc: null
}