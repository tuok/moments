import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { Button, TextField } from "@material-ui/core";

const styles = {
  menuIcon: {
    marginLeft: -18,
    marginRight: 20,
  },

  flex: {
    flexGrow: 1,
  },

  button: {
    marginLeft: 6,
  },

  appbarStyle: {
    marginBottom: 15,
  },

  loginStyle: {
    marginBottom: 15,
    marginRight: 20,
  }
}

export default class Layout extends React.Component {
  render() {
    return (
      <AppBar position="static" style={styles.appbarStyle}>
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            style={styles.flex}
          >
            Moments &lt;3
          </Typography>
          <TextField
            id="username"
            label="Käyttäjä"
            style={styles.loginStyle}
            onChange={e => this.props.setUser(e.target.value)}
          />
          <TextField
            id="password"
            label="Salasana"
            type="password"
            style={styles.loginStyle}
            onChange={e => this.props.setPass(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            style={styles.button}
            onClick={e => this.props.fetchData() }
          >
            Hae tiedot
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={styles.button}
            disabled={!this.props.newEntryButtonEnabled}
            onClick={e => this.props.handleNewEntryClick(null)}
          >
            Uusi kirjaus
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
}
