import React, { Fragment } from 'react'
import { TextField, Paper, Typography, Popover, MenuItem } from '@material-ui/core'

export default class AutoComplete extends React.Component {
  constructor(props) {
    super(props)

    this.handlePopoverClose = this.handlePopoverClose.bind(this)
  }
  state = {
    options: [],
    anchorElement: null,
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

      this.setState({
        options: options,
        anchorElement: target,
      })
    }
    else {
      this.setState({
        options: [],
        anchorElement: null,
      })
    }
  }

  handlePopoverClose() {
    this.setState({anchorElement: null})
  }

  render() {
    const optionTexts = this.state.options.map(opt => {
        return <MenuItem key={opt}>{opt}</MenuItem>
    })

    return (
      <Fragment>
        <TextField
          fullWidth
          margin='normal'
          label={this.props.label}
          onChange={e => this.handleSearchTermChange(e.currentTarget, e.target.value)}
        />
        <Popover
          open={this.state.options.length > 0}
          anchorEl={this.state.anchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClick={this.handlePopoverClose}
          onClose={this.handlePopoverClose}
          disableAutoFocus={true}
          disableEnforceFocus={true}
        >
          {optionTexts}
        </Popover>
      </Fragment>
    )
  }
}