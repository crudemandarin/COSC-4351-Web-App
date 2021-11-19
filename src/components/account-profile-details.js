import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  }
];

export const AccountProfileDetails = (props) => {

  const [values, setValues] = useState({
    ...props.currentuser
  });


  const handleChange = (event) => {
    console.log(event)
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phoneNumber}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                required
                fullWidth
                id="mailingAddress"
                label="Mailing Address"
                name="mailingAddress"
                autoComplete="mailing-address"
                required
                onChange={handleChange}
                value={values.mailingAddress}
                variant="outlined"
              />

            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField

                required
                fullWidth
                id="billingAddress"
                label="Billing Address"
                name="billingAddress"
                autoComplete="billing-address"
                required
                onChange={handleChange}
                value={values.billingAddress}
                variant="outlined"
              />

            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="preferredPayment">Prefered Payment Method</InputLabel>
                <Select
                  labelId="preferredPayment"
                  id="demo-simple-select"
                  value={values.preferedMethod}
                  label="Prefered Payment Method"
                  onChange={handleChange}
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
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
