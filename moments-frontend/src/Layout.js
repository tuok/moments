import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import { Button } from "@material-ui/core";

const styles = {
  menuIcon: {
    marginLeft: -18,
    marginRight: 20,
  },

  flex: {
    flexGrow: 1,
  },

  addButton: {
    marginLeft: 6,
  }
}


export default class Layout extends React.Component {
  render() {
    return (
      <div className="testi">
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              style={styles.flex}
            >
              Moments life logger &lt;3
            </Typography>
            <Button variant="contained" color="secondary">
              Uusi kirjaus
              <AddIcon style={styles.addButton} />
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
