import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import PersonIcon from "@mui/icons-material/Person";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

import { Avatar } from "@mui/material";

// Firebase Code
import AuthProvider, { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

// Success/Error Alerts
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

// Account
import { AccountProfile } from "./AccountProfile";
import { AccountProfileDetails } from "./AccountProfileDetails";
import avatar from "../assets/avatar.jpg";
import eating2 from "../assets/eating2.svg";

const Navbar = (props) => {
  const { currentUser, logout, login } = React.useContext(AuthContext);

  const [user, setUser] = React.useState(currentUser);

  const history = useNavigate();

  const menuId = "primary-search-account-menu";
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleLogOut = () => {
    logout()
      .then((res) => {
        localStorage.removeItem("token");
        if (props.parent === "confirmation") {
          history("/confirmation");
        } else {
          history("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <AppBar
        position="fixed"
        style={{
          background: "rgba(255, 255, 255)",
          display: "flex",
        }}
      >
        <Toolbar>
          <Link to="/" style={{ color: "#000", flex: 1 }}>
            The Restaurant
          </Link>
          {currentUser ? (
            <>
              <Typography variant="h6" style={{ color: "#000" }}>
                Hello {currentUser.firstName}!
              </Typography>
              <IconButton
                style={{ color: "#000" }}
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar
                  src={avatar}
                  sx={{
                    height: 34,
                    width: 34,
                  }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                id={menuId}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleMenuClose}
                >
                  <PersonIcon style={{ margin: "10px" }} />
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/reservations"
                  onClick={handleMenuClose}
                >
                  <DinnerDiningIcon style={{ margin: "10px" }} />
                  Reservations
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <SettingsIcon style={{ margin: "10px" }} />
                  Settings
                </MenuItem>

                <MenuItem onClick={handleLogOut}>
                  <LogoutIcon style={{ margin: "10px" }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <div>
                <Button href="/login">
                  <AccountCircleIcon style={{ margin: "10px" }} />
                  Login
                </Button>
                <Button href="/signup">
                  <ExitToAppIcon style={{ margin: "10px" }} />
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
