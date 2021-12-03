import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import MuiAlert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TimeLables from "../Landing/TimeLables";
import PendingTimer from "./PendingTimer";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import Box from "@mui/material/Box";
import Navbar from "../../components/Navbar";
import confetti from "canvas-confetti";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";

import ApiManager from "../../api/api-manager";
import User from "../../data/user-data";

// Assets
import confirmation from "../../assets/confirmation.png";

// Firebase Code
import { AuthContext } from "../../contexts/AuthContext";

// History
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const getNextTenYears = () => {
  let tenYears = [];
  let date = new Date();
  for (let year = date.getFullYear(); year <= date.getFullYear() + 8; year++)
    tenYears.push(String(year));
  return tenYears;
};

const Confirmation = () => {
  const [guestInfo, setGuestInfo] = React.useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const { currentUser, logout, login } = React.useContext(AuthContext);

  const [pendingReservation, setPendingReservation] = React.useState(null);

  const [openCreditCard, setOpenCreditCard] = React.useState(false); //set to true to see credit card modal
  const [creditCard, setCreditCard] = React.useState({
    name: "",
    cardNumber: "",
    month: "1",
    year: String(new Date().getFullYear()),
    cvc: "",
  });

  const history = useNavigate();

  React.useEffect(() => {
    const storedReservation = localStorage.getItem("pendingReservation");
    if (storedReservation) {
      setPendingReservation(JSON.parse(storedReservation));
    }
  }, []);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    currentUser ? history("/reservations") : history("/");
    localStorage.removeItem("pendingReservation");
  };

  const handleSubmitCreditCard = (event) => {
    event.preventDefault();
    setOpenCreditCard(false);
    console.log(creditCard);
    completeConfirmReservation();
  };

  const handleConfirmForm = (event) => {
    event.preventDefault();

    if (pendingReservation.isHoliday) {
      setOpenCreditCard(true);
    } else {
      completeConfirmReservation();
    }
  };

  const completeConfirmReservation = () => {
    const user = new User();

    if (currentUser) {
      user.id = currentUser.userid;
      user.firstName = currentUser.firstName;
      user.lastName = currentUser.lastName;
      user.phoneNumber = currentUser.phoneNumber;
      user.email = currentUser.email;
    } else {
      user.firstName = guestInfo.firstName;
      user.lastName = guestInfo.lastName;
      user.phoneNumber = guestInfo.phoneNumber;
      user.email = guestInfo.email;
    }

    ApiManager.bookReservation(
      pendingReservation.id,
      user,
      pendingReservation.isHoliday ? creditCard : undefined
    ).subscribe({
      next: (ret) => {
        setOpenSuccess(true);
        confetti({
          particleCount: 200,
          spread: 180,
          zIndex: 2000,
          origin: { x: 0.5, y: 0.8 },
        });
      },
      error: (err) => {
        setOpenError(true);
        console.log("Book Reservation Failed!", err);
      },
    });
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar parent="confirmation" />

      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid item xs={7} style={{ padding: "40px", marginTop: "70px" }}>
          <Typography variant="body2" style={{ marginBottom: "20px" }}>
            Thank you for reserving with us!
          </Typography>
          <Grid container>
            <Grid
              item
              xs={4}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <DateRangeIcon style={{ padding: "10px" }} />
              {pendingReservation ? pendingReservation.date : null}
            </Grid>
            <Grid
              item
              xs={4}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <AccessTimeIcon style={{ padding: "10px" }} />
              {pendingReservation
                ? TimeLables.get(pendingReservation.time)
                : null}
            </Grid>
            <Grid
              item
              xs={4}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <GroupIcon style={{ padding: "10px" }} />
              {pendingReservation ? pendingReservation.guests : null} guest(s)
            </Grid>
          </Grid>
          <Paper
            elevation={0}
            style={{
              backgroundColor: "#CEF5F5",
              padding: "15px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "row",
              gap: "7px",
            }}
          >
            <AccessAlarmIcon fontSize="small" />
            {pendingReservation ? (
              <PendingTimer
                time={pendingReservation.createdAt + 600000 - Date.now()}
              />
            ) : null}
            minutes left to confirm reservation!
          </Paper>
          <Divider
            variant="middle"
            spacing={3}
            style={{ marginBottom: "20px" }}
          />
          {!currentUser ? (
            <Typography variant="body2" style={{ marginBottom: "20px" }}>
              Please
              <Link
                href="/login"
                underline="none"
                style={{ padding: "5px", color: "#FF6C6C" }}
              >
                Sign in
              </Link>
              or
              <Link
                href="/signup"
                underline="none"
                style={{ padding: "5px", color: "#FF6C6C" }}
              >
                Sign up
              </Link>
              to collect your points and earn a free dinner on us!
            </Typography>
          ) : null}

          <Typography
            variant="body1"
            style={{ marginBottom: "15px", fontSize: "18px" }}
          >
            Contact Details
          </Typography>
          <Box component="form" onSubmit={handleConfirmForm}>
            <Grid container spacing={2} style={{ marginBottom: "15px" }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="First Name"
                  label="First Name"
                  required
                  value={
                    currentUser ? currentUser.firstName : guestInfo.firstName
                  }
                  disabled={currentUser}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) =>
                    setGuestInfo({
                      ...guestInfo,
                      firstName: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="Last Name"
                  label="Last Name"
                  required
                  value={
                    currentUser ? currentUser.lastName : guestInfo.lastName
                  }
                  disabled={currentUser}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) =>
                    setGuestInfo({
                      ...guestInfo,
                      lastName: event.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginBottom: "15px" }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="Phone Number"
                  label="Phone Number"
                  required
                  value={
                    currentUser
                      ? currentUser.phoneNumber
                      : guestInfo.phoneNumber
                  }
                  disabled={currentUser}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) =>
                    setGuestInfo({
                      ...guestInfo,
                      phoneNumber: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="Email"
                  label="Email"
                  required
                  type="email"
                  value={currentUser ? currentUser.email : guestInfo.email}
                  disabled={currentUser}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) =>
                    setGuestInfo({
                      ...guestInfo,
                      email: event.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>

            <TextField
              id="outlined-multiline-flexible"
              label="Special Request"
              multiline
              rows={4}
              maxRows={4}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <Button fullWidth variant="contained" type="submit">
              Confirm Reservation
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            backgroundImage: `url(${confirmation})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      <Dialog
        onClose={handleCloseSuccess}
        open={openSuccess}
        TransitionComponent={Transition}
      >
        <DialogTitle style={{ marginBottom: "20px" }}>
          {handleCloseSuccess ? (
            <IconButton
              aria-label="close"
              onClick={handleCloseSuccess}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Alert severity="success" style={{ marginBottom: "20px" }}>
              You reservation has been successfully booked
            </Alert>

            <Alert icon={false} severity="info" variant="outlined">
              Please note down your reservation id{" "}
              <strong>
                {pendingReservation ? pendingReservation.id : null}
              </strong>{" "}
              to view your reservation later if you aren't registered
            </Alert>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openError}
        autoHideDuration={3500}
      >
        <Alert severity="error">
          Unable to book reservation, please try later
        </Alert>
      </Snackbar>

      {/* Credit Card Dialog */}
      <Dialog open={openCreditCard} onClose={() => setOpenCreditCard(false)}>
        <DialogTitle>{"Credit Card Information"}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: "10px" }}>
            Since your reservation is during a special holiday, you need a
            credit card on file for a $10 reservation fee
          </DialogContentText>

          <Box component="form" onSubmit={handleSubmitCreditCard}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Card Number"
              name="Card Number"
              value={creditCard.cardNumber}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setCreditCard({ ...creditCard, cardNumber: event.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="Name on Card"
              label="Name on Card"
              value={creditCard.name}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setCreditCard({ ...creditCard, name: event.target.value })
              }
            />

            <TextField
              margin="normal"
              name="Month"
              label="Month"
              select
              value={"1"}
              style={{ paddingRight: "10px" }}
              value={creditCard.month}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setCreditCard({ ...creditCard, month: event.target.value })
              }
            >
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
              ].map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              name="Year"
              label="Year"
              select
              style={{ paddingRight: "10px" }}
              value={creditCard.year}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setCreditCard({ ...creditCard, year: event.target.value })
              }
            >
              {getNextTenYears().map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              name="CVC"
              label="CVC"
              value={creditCard.cvc}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) =>
                setCreditCard({ ...creditCard, cvc: event.target.value })
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Confirmation;
