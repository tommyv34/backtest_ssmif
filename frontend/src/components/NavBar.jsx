import { Link } from "react-router-dom"

import AppBar from "@mui/material/AppBar"
import ToolBar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"

import "../styles/styles.css"

function NavBar() {
  return (
    <AppBar position="static" className="appBar">
      <ToolBar>
        <Button 
          className="nav-button" 
          component={Link}
          to="/"
        >
          Home
        </Button>
      </ToolBar>
    </AppBar>
  );
}

export default NavBar;
