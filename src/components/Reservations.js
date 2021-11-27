import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import PersonIcon from "@mui/icons-material/Person";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import SettingsIcon from "@mui/icons-material/Settings";

// Firebase Code
import AuthProvider, { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import Chip from "@mui/material/Chip";

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
import { Link } from "react-router-dom";

// Account
import { AccountProfile } from "./AccountProfile";
import { AccountProfileDetails } from "./AccountProfileDetails";
import avatar from "../assets/avatar.jpg";
import reservation from "../assets/reservation.svg";

import { Avatar } from "@mui/material";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../styles/styles.css";
import ApiManager from "../api/api-manager";

function createData(startDate, startTime, status, numGuests) {
  if (status === 0) {
    status = "pending";
  } else if (status === 1) {
    status = "confirmed";
  } else if (status === 2) {
    status = "expired";
  }

  return { startDate, startTime, status, numGuests };
}

const rows = [
  createData("2020/20/2", "10:00pm", 0, 3),
  createData("2021/21/1", "9:00pm", 1, 4),
  createData("2021/21/4", "8:00pm", 2, 4),
];

export default function Profile() {
  const { currentUser, logout, login } = React.useContext(AuthContext);

  const history = useNavigate();

  const menuId = "primary-search-account-menu";
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => getData(), [currentUser]);

  const getData = () => {
    if (!currentUser) return;
    const userId = currentUser.userid;
    console.log(userId);
    ApiManager.getReservationsByUserId(userId).subscribe({
      next: (reservations) => {
        console.log("getReservationsByUserId success!", reservations);
      },
      error: (err) => {
        console.log("getReservationsByUserId failed!", err);
      },
    });
  };

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
        history("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container
      sx={{
        width: "600px",
        display: "flex",
        width: "100%",
      }}
    >
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

      <Grid
        container
        style={{ marginTop: "80px", width: "100%", alignItems: "center" }}
      >
        {currentUser ? (
          <>
            <Grid container sx={{ alignItems: "center" }}>
              <>
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    py: 3,
                  }}
                >
                  <Container maxWidth="lg">
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="h5">Your Reservations</Typography>
                        <img
                          src={reservation}
                          style={{
                            height: 310,
                            width: 310,
                            textAlign: "center",
                          }}
                        />
                      </Grid>

                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 550 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">Start Date</TableCell>
                              <TableCell align="left">Time</TableCell>

                              <TableCell align="left">
                                Number of Guests
                              </TableCell>
                              <TableCell align="left">Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row) => (
                              <TableRow
                                key={row.startDate}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell align="left" scope="row">
                                  {row.startDate}
                                </TableCell>
                                <TableCell align="left" scope="row">
                                  {row.startTime}
                                </TableCell>
                                <TableCell align="left">
                                  {row.numGuests}
                                </TableCell>
                                <TableCell align="left">
                                  <Chip
                                    label={row.status}
                                    className={row.status}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Container>
                </Box>
              </>
            </Grid>
          </>
        ) : null}
      </Grid>
    </Container>
  );
}
