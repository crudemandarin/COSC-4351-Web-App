import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import background from "../../assets/landing.png";
import logo from "../../assets/logo.png";
import ApiManager from "../../api/api-manager";

const theme = createTheme();

const Landing = () => {
  const [value, setValue] = React.useState(new Date("2014-08-18T21:11:54"));

  ApiManager.fetchReservations().subscribe({
    next: () => {
      console.log(ApiManager.getReservations());
    },
    error: (err) => {
      console.log("ApiManager.getReservations: Could not fetch reservations");
    },
  });

  const handleChange = (newValue: any) => {
    setValue(newValue);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get("email"),
      password: data.get("password"),
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
        ></Grid>
        <Grid item md={3} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 9,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "40px",
            }}
          >
            <img src={logo} style={{ width: "70%", height: "70%" }} />
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
              label="Birthday"
              type="date"
              defaultValue="2017-05-24"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "15px" }}
            />
            <TextField
              id="time"
              label="Alarm clock"
              type="time"
              defaultValue="07:30"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              style={{ marginBottom: "15px" }}
            />
            <TextField
              id="outlined-number"
              label="Number of Guests"
              type="number"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "15px" }}
            />
            <Button type="submit" fullWidth variant="contained">
              Find a Table
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Landing;
