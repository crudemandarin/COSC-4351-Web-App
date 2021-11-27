import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import background from "../../assets/landing.png";
import logo from "../../assets/logo.png";
import ApiManager from "../../api/api-manager";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LockIcon from "@mui/icons-material/Lock";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import TimeLables from "./TimeLables";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { json } from "stream/consumers";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

const getCurrentDate = (): string => {
  const dateNow: Date = new Date(Date.now());
  return (
    dateNow.getFullYear() +
    "-" +
    (dateNow.getMonth() + 1) +
    "-" +
    dateNow.getDate()
  );
};

const getTimeList = (date: string): string[] => {
  let times: string[] = [];
  let today: Date = new Date();
  let todayStr: string =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  let startHour =
    todayStr === date && today.getHours() > 9 ? today.getHours() + 1 : 9;

  for (let time = startHour; time < 23; time++) {
    times.push(
      Math.floor(time / 10) === 0
        ? "0" + String(time) + ":00"
        : String(time) + ":00"
    );
    times.push(
      Math.floor(time / 10) === 0
        ? "0" + String(time) + ":30"
        : String(time) + ":30"
    );
  }

  return times.length > 0 ? times : ["No Times"];
};

const Landing = () => {
  const navigate = useNavigate();

  const [date, setDate] = React.useState(getCurrentDate());
  const [times, setTimes] = React.useState(getTimeList(date));
  const [time, setTime] = React.useState(times[0]);

  const [guests, setGuests] = React.useState("1");

  const [reservationId, setReservationId] = React.useState("");
  const [openReservationID, setOpenReservationID] = React.useState(false);
  const [checkReservationError, setCheckReservationError] =
    React.useState(false);
  const [checkedReservation, setCheckedReservation] = React.useState({});
  const handleClickOpenReservationID = () => setOpenReservationID(true);
  const handleCloseReservationID = () => setOpenReservationID(false);

  const [loading, setLoading] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);

  const handleCloseSnack = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const handleCheckReservation = () => {
    ApiManager.getReservation(reservationId).subscribe({
      next: (reservation) => {
        if (reservation.id) {
          setCheckReservationError(false);
          console.log(reservation);
        } else {
          setCheckReservationError(true);
        }
      },
      error: (err) => {
        setCheckReservationError(true);
        console.log(err);
      },
    });
  };

  const handleReservation = () => {
    if (time === "No Times") {
      alert("Please pick a different date and time!");
      return;
    }
    setLoading(true);

    const datetime = new Date(date + "T" + time).getTime();

    ApiManager.createReservation(datetime, parseInt(guests, 10)).subscribe({
      next: (reservationId) => {
        let pendingReservation = {
          id: reservationId,
          date: date,
          time: time,
          guests: guests,
          createdAt: Date.now(),
        };
        localStorage.setItem(
          "pendingReservation",
          JSON.stringify(pendingReservation)
        );
        setLoading(false);
        navigate(`/confirmation`);
      },
      error: (err) => {
        console.log("createReservation Failed!", err);
        setLoading(false);
        setOpenSnack(true);
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          md={9}
          xs={false}
          sx={{
            backgroundImage: `url(${background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item md={3} component={Paper} elevation={6} square>
          {loading ? <LinearProgress /> : null}
          <Box
            sx={{
              my: 9,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <img
              src={logo}
              style={{ width: "70%", height: "70%" }}
              alt="logo of company"
            />
            <Typography variant="h4" style={{ textAlign: "center" }}>
              Welcome to <br /> The Restaurant
            </Typography>
            <Typography
              variant="h6"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Make a Reservation
            </Typography>

            <TextField
              id="date"
              label="Date"
              type="date"
              value={date}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "15px" }}
              onChange={(e) => {
                setDate(e.target.value);
                const timeList = getTimeList(e.target.value);
                setTimes(timeList);
                setTime(timeList[0]);
              }}
              InputProps={{
                inputProps: { min: getCurrentDate() },
              }}
            />
            <TextField
              select
              label="Time"
              fullWidth
              value={time}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "15px" }}
              onChange={(e) => setTime(e.target.value)}
            >
              {times.map((time) => (
                <MenuItem key={time} value={time}>
                  {TimeLables.get(time)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-number"
              label="Number of Guests"
              type="number"
              value={guests}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "15px" }}
              onChange={(e) =>
                setGuests(
                  Number(e.target.value) > 1 && Number(e.target.value) <= 30
                    ? e.target.value
                    : "1"
                )
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleReservation}
              style={{ marginBottom: "15px" }}
            >
              Find a Table
            </Button>

            <Typography
              variant="h6"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              View Reservations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleClickOpenReservationID}
                  style={{ marginBottom: "15px" }}
                >
                  Reservation ID
                </Button>
              </Grid>
              <Grid item xs={6} md={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* Check Reservation Modal */}
      <Dialog open={openReservationID} onClose={handleCloseReservationID}>
        <DialogTitle style={{ fontSize: "25px", padding: "15px" }}>
          Check Reservation <FactCheckIcon />
        </DialogTitle>
        <DialogContent style={{ paddingBottom: "0px" }}>
          <TextField
            label="Reservation ID"
            fullWidth
            variant="standard"
            value={reservationId}
            onChange={(event) => setReservationId(event.target.value)}
            error={checkReservationError}
            helperText={
              checkReservationError ? "Please correct your reservation id" : ""
            }
            style={{ marginBottom: "10px" }}
          />
          <Grid container>
            <Grid item>
              <DateRangeIcon />
              {/* {checkedReservation ? checkedReservation.date : null} */}
            </Grid>
            <Grid item>
              <AccessTimeIcon />
              {/* {checkedReservation
                ? TimeLables.get(checkedReservation.time)
                : null} */}
            </Grid>
            <Grid item>
              <GroupIcon />
              {/* {checkedReservation ? checkedReservation.guests : null} guest(s) */}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCheckReservation}>Find</Button>
          <Button onClick={handleCloseReservationID}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnack}>
        <Alert
          onClose={handleCloseSnack}
          severity="error"
          sx={{ width: "100%" }}
        >
          Unable to find a reservation for the given date, time and number of
          guests. Please make a different selection!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Landing;
