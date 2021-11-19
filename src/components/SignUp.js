
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// Firebase Code
import AuthProvider, { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase/firebase'
import { collection, addDoc } from "firebase/firestore";

import {
    useNavigate,
} from 'react-router-dom';

// Success/Error Alerts
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

export default function LogIn() {
    const { signup } = React.useContext(AuthContext);
    const history = useNavigate();
    const [openError, setOpenError] = React.useState(false);
    const [error, setError] = React.useState("");
    const [mailingAddressEqual, setMailingAddressEqual] = React.useState(false);
    const [preferedP, setPreferedP] = React.useState('');
    const [disabled, setDisabled] = React.useState(false);

    const handleChange = (event) => {
        setPreferedP(event.target.value);
    };

    const findError = (err) => {
        let errorMessage = "";
        switch (err.code) {
            case "auth/weak-password":
                errorMessage = "Your password is too weak! We require at least 6 characters.";
                break;
            case "auth/email-already-in-use":
                errorMessage = "This email is already in use. Please login or use another email.";
                break;
            default:
                errorMessage = "An error happened. Please check your entries.";
        }
        return errorMessage;
    }

    const handleChangeSame = (event) => {
        setDisabled(event.target.checked)
        setMailingAddressEqual(event.target.checked);
      };


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

       const dataSentToFirebase = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            phoneNumber: data.get('phoneNumber'),
            mailingAddress: data.get('mailingAddress'),
            billingAddress: mailingAddressEqual ? data.get('mailingAddress') : data.get('billingAddress'),
            preferedMethod:  preferedP,
        }

        console.log(dataSentToFirebase)


        // It returns a Promise
        signup(data.get('email'), data.get('password'), data.get('firstName'), data.get('lastName'))
            .then(user => {
                localStorage.setItem("token", user.user.accessToken);

                addDoc(collection(db, "users"), {...dataSentToFirebase,                  
                    uid: user.user.uid,
                    email: user.user.email,
                })
                    .then(res => {
                        console.log('User added to database')
                        history('/')
                        console.log('Sign Up from Sign Up component')
                        setOpenError(false)

                    })
                    .catch(err => {
                        console.log('Error with Adding user to db');

                        setError(findError(err)); //Change later
                        setOpenError(true)
                    })



            }).catch(err => {
                console.log(findError(err));

                setError(findError(err)); //Change later
                setOpenError(true)
            });



        


    };

    return (
        <Container component="main" maxWidth="xs" sx={{
            width: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <CssBaseline />
            <Box
                sx={{
                    width: '600px',
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >

                <Collapse in={openError}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpenError(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        severity="error"
                    >
                        {error}
                    </Alert>
                </Collapse>




                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                fullWidth
                                id="phoneNumber"
                                label="Phone Number"
                                name="phoneNumber"
                                autoComplete="phone-number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="mailingAddress"
                                label="Mailing Address"
                                name="mailingAddress"
                                autoComplete="mailing-address"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                disabled={disabled}
                                required
                                fullWidth
                                id="billingAddress"
                                label="Billing Address"
                                name="billingAddress"
                                autoComplete="billing-address"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>

                            <FormControlLabel control={
                                <Checkbox
                                    checked={mailingAddressEqual}
                                    onChange={handleChangeSame}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    name="sameInfo" />
                                 }
                                label="Check here if the mailing address is the same as the billing address" />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <InputLabel id="preferredPayment">Prefered Payment Method</InputLabel>
                                <Select
                                    labelId="preferredPayment"
                                    id="demo-simple-select"
                                    value={preferedP}
                                    label="Prefered Payment Method"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Cash</MenuItem>
                                    <MenuItem value={2}>Credit</MenuItem>
                                    <MenuItem value={3}>Check</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>

                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

        </Container>


    );
}