import React from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { TextField, Button, Chip, Typography } from '@material-ui/core'

import AutoComplete from './AutoComplete'
import { getTimeComponentsFromTimestamp } from './Utils'

const tagStyle = {
  marginRight: 5,
  marginTop: 5,
}

const errorTextStyle = {
  marginTop: 8,
  color: "red",
}

export default class EntryDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      tags: [],
      errorText: "",
      entry: this.props.entry,
      title: "",
      text: "",
      startTimestamp: "",
      endTimestamp: "",
      startTimestampValid: true,
      endTimestampValid: true,
      startTimeComponents: null,
      endTimeComponents: null,
    }

    this.handleTagInsert = this.handleTagInsert.bind(this)
    this.handleTagRemove = this.handleTagRemove.bind(this)
    this.removeLastTag = this.removeLastTag.bind(this)
  }

  clearData() {
    this.setState({
      tags: [],
      entry: null,
      title: "",
      text: "",
      startTimestamp: "",
      endTimestamp: "",
      startTimestampValid: true,
      endTimestampValid: true,
      startTimeComponents: null,
      endTimeComponents: null,
    })
  }

  componentDidMount() {
    if (this.props.entry) {
      this.setState({
        title: this.props.title,
        text: this.props.text,
        startTimestamp: this.props.startTimestamp,
        endTimestamp: this.props.endTimestamp,
        tags: this.props.entry,
      })
    }
  }

  handleEntryChange(name, val) {
    // If timestamp changed, validate it
    if (name === "startTimestamp") {
      if (val === "") {
        this.setState({
          startTimestamp: "",
          startTimestampValid: true,
          startTimeComponents: null,
        })
      } else {
        let components = getTimeComponentsFromTimestamp(val)

        if (components === false) {
          this.setState({
            startTimestamp: "",
            startTimestampValid: false,
            startTimeComponents: null,
          })
        } else {
          this.setState({
            startTimestamp: val,
            startTimestampValid: true,
            startTimeComponents: components,
          })
        }
      }
    }
    else if (name === "endTimestamp") {
      if (val === "") {
        this.setState({
          endTimestamp: "",
          endTimestampValid: true,
          endTimeComponents: null,
        })
      } else {
        let components = getTimeComponentsFromTimestamp(val)

        if (components === false) {
          this.setState({
            endTimestamp: "",
            endTimestampValid: false,
            endTimeComponents: null,
          })
        } else {
          this.setState({
            endTimestamp: val,
            endTimestampValid: true,
            endTimeComponents: components,
          })
        }
      }
    }
    else {
      this.setState({[name]: val})
    }
  }

  handleTagInsert(tag) {
    let tags = this.state.tags.slice()
    tags.push(tag)
    this.setState({tags: tags})
  }

  handleTagRemove(tag) {
    let tags = this.state.tags.filter(t => t !== tag)
    this.setState({tags: tags})
  }

  removeLastTag() {
    let tags = this.state.tags.slice()
    tags.pop()
    this.setState({tags: tags})
  }

  handleEntry() {
    if (this.state.text.length < 5) {
      this.setState({errorText: "Kirjauksen teksti on liian lyhyt."})
      return
    }

    if (!this.state.startTimestampValid) {
      this.setState({errorText: "Kirjauksen alkuajankohta on virheellinen."})
      return
    }

    if (!this.state.endTimestampValid) {
      this.setState({errorText: "Kirjauksen loppuajankohta on virheellinen."})
      return
    }

    if (this.state.tags.length < 1) {
      this.setState({errorText: "Kirjauksella ei ole yhtäkään tägiä."})
      return
    }

    let entry = {
      //author: "tuomas",
      //links_to: [],
      title: this.state.title,
      text: this.state.text,
      start_time_components: this.state.startTimeComponents,
      end_time_components: this.state.endTimeComponents,
      start_readable_timestamp: this.state.startTimestamp,
      end_readable_timestamp: this.state.endTimestamp,
      tags: this.state.tags,
      private: false,
    }

    if (this.props.entry) {
      entry.id = this.props.entry.id
    }

    this.props.handleEntryMod(entry)
  }

  render() {
    const tags = this.state.tags.map(tag => {
      return <Chip key={tag} label={tag} onDelete={e => this.handleTagRemove(tag) } style={tagStyle} />
    })

    return (
      <Dialog
        open={this.props.opened}
        onClose={e => this.props.handleClose(false, null)}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        <DialogTitle>Kirjauksen muokkaus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tässä näkymässä voit luoda uusia kirjauksia tai muokata olemassa olevia kirjauksia.
          </DialogContentText>
          {this.state.errorText.length > 0
            ? <Typography
                variant="body1"
                style={errorTextStyle}
              >
                {this.state.errorText}
              </Typography>
            : null}
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            id="title"
            label="Kirjauksen otsikko"
            onChange={e => this.handleEntryChange('title', e.target.value)}
          />
          <TextField
            required
            fullWidth
            multiline
            rowsMax="20"
            margin="normal"
            id="text"
            label="Kirjauksen teksti"
            onChange={e => this.handleEntryChange('text', e.target.value)}
          />
          <AutoComplete
              label="Tägit"
              options={this.props.tags}
              optionsFrequencies={this.props.tagsFrequencies}
              threshold={2}
              maxResults={8}
              onOptionSelected={this.handleTagInsert}
              emptyBackspaceFunc={this.removeLastTag}
          />
          {tags}
          <TextField
            error={!this.state.startTimestampValid}
            required
            fullWidth
            margin="normal"
            id="startTimestamp"
            label="Alkuajankohta"
            onChange={e => this.handleEntryChange('startTimestamp', e.target.value)}
          />
          <TextField
            error={!this.state.endTimestampValid}
            fullWidth
            margin="normal"
            id="endTimestamp"
            label="Loppuajankohta"
            onChange={e => this.handleEntryChange('endTimestamp', e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={e => this.props.handleClose()}>
            Peruuta
          </Button>
          <Button onClick={e => this.handleEntry()}>
            Lisää kirjaus
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}