import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import AuthProvider, { AuthContext } from "../contexts/AuthContext";

// Success/Error Alerts
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import confetti from "canvas-confetti";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AccountProfileDetails = (props) => {
  const { currentUser, setCurrentUser } = React.useContext(AuthContext);

  const [mailingAddressEqual, setMailingAddressEqual] = useState(
    currentUser.billingAddress === currentUser.mailingAddress ? true : false
  );
  const [preferedP, setPreferedP] = useState(currentUser.preferedMethod);
  const [disabled, setDisabled] = useState(
    currentUser.billingAddress === currentUser.mailingAddress ? true : false
  );

  // Success/Error
  const [successSubmit, setSuccess] = useState(false);
  const [errorSubmit, setError] = useState();

  const handleChange = (event) => {
    setCurrentUser({
      ...currentUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeP = (event) => {
    setPreferedP(event.target.value);
  };

  const handleChangeSame = (event) => {
    setDisabled(event.target.checked);
    setCurrentUser({
      ...currentUser,
      billingAddress: currentUser.mailingAddress,
    });
    setMailingAddressEqual(event.target.checked);
  };

  const handleSubmit = (event) => {
    if (currentUser) {
      event.preventDefault();

      const dataSentToFirebase = {
        uid: currentUser.uid,
        userid: currentUser.userid,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        mailingAddress: currentUser.mailingAddress,
        billingAddress: mailingAddressEqual
          ? currentUser.mailingAddress
          : currentUser.billingAddress,
        preferedMethod: parseInt(preferedP),
      };

      const userRef = doc(db, "users", currentUser.userid);

      updateDoc(userRef, dataSentToFirebase)
        .then((res) => {
          setSuccess(true);
          confetti();
          setCurrentUser(dataSentToFirebase);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  const handleCloseError = () => {
    setError(false);
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader={
            <Typography
              sx={{
                color: "#fff",
              }}
            >
              The information can be edited
            </Typography>
          }
          title="Your Profile"
          sx={{
            backgroundColor: "#00B0FF",
            color: "#fff",
            fontWeight: "800",
          }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={currentUser.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={currentUser.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                onChange={handleChange}
                required
                value={currentUser.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                type="phone"
                onChange={handleChange}
                value={currentUser.phoneNumber}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                required
                fullWidth
                id="mailingAddress"
                label="Mailing Address"
                name="mailingAddress"
                type="address"
                autoComplete="mailing-address"
                required
                onChange={handleChange}
                value={currentUser.mailingAddress}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                disabled={disabled}
                required
                fullWidth
                id="billingAddress"
                label="Billing Address"
                name="billingAddress"
                autoComplete="billing-address"
                required
                onChange={handleChange}
                value={currentUser.billingAddress}
                variant="outlined"
              />
              <Grid item xs={12} sm={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mailingAddressEqual}
                      onChange={handleChangeSame}
                      inputProps={{ "aria-label": "controlled" }}
                      name="sameInfo"
                    />
                  }
                  label="Check here if the mailing address is the same as the billing address"
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="preferredPayment">
                  Prefered Payment Method
                </InputLabel>
                <Select
                  labelId="preferredPayment"
                  id="demo-simple-select"
                  value={preferedP}
                  label="Prefered Payment Method"
                  onChange={handleChangeP}
                  name="preferedMethod"
                >
                  <MenuItem value={1}>Cash</MenuItem>
                  <MenuItem value={2}>Credit</MenuItem>
                  <MenuItem value={3}>Check</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button
            type="submit"
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "#00B0FF",
            }}
          >
            Save details
          </Button>
        </Box>
      </Card>

      <Snackbar
        open={successSubmit}
        autoHideDuration={8000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your profile was successfully updated!
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorSubmit}
        autoHideDuration={8000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          You need to verify your information details!
        </Alert>
      </Snackbar>
    </form>
  );
};
