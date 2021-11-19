
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
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import PersonIcon from '@mui/icons-material/Person';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import SettingsIcon from '@mui/icons-material/Settings';

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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

// Account
import { AccountProfile } from '../components/AccountProfile';
import { AccountProfileDetails } from '../components/AccountProfileDetails';

export default function Profile() {

    const { currentUser, logout, login } = React.useContext(AuthContext);
    const { signup } = React.useContext(AuthContext);
    const history = useNavigate();
    const [openError, setOpenError] = React.useState(false);
    const [error, setError] = React.useState("");
    const [mailingAddressEqual, setMailingAddressEqual] = React.useState(false);
    const [preferedP, setPreferedP] = React.useState('');
    const [disabled, setDisabled] = React.useState(false);
    const menuId = 'primary-search-account-menu';
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

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
                errorMessage = "An undefined error happened.";
        }
        return errorMessage;
    }

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
            .then(res => {
                localStorage.clear();
                history('/')
            })
            .catch(err => {
                console.log(err);
            });
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const dataSentToFirebase = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            phoneNumber: data.get('phoneNumber'),
            mailingAddress: data.get('mailingAddress'),
            billingAddress: mailingAddressEqual ? data.get('mailingAddress') : data.get('billingAddress'),
            preferedMethod: preferedP,
        }

        console.log(dataSentToFirebase)

        // It returns a Promise
        signup(data.get('email'), data.get('password'), data.get('firstName'), data.get('lastName'))
            .then(user => {
                localStorage.setItem("token", user.user.accessToken);

                addDoc(collection(db, "users"), {
                    ...dataSentToFirebase,
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
        <Container  sx={{
            width: '600px',
            display: 'flex',
            width: '100%'
        }}>
            
            <AppBar
                position="fixed" style={{
                    background: "rgba(255, 255, 255)",
                    display: 'flex',
                }}>
                <Toolbar>
                    <Link href="/" style={{ color: '#000', flex: 1 }}>
                        The Restaurant
                    </Link>
                    {currentUser ? (
                        <>
                            <Typography variant="h6" style={{ color: '#000' }}>
                                Hello {currentUser.firstName}!
                            </Typography>
                            <IconButton
                                style={{ color: '#000' }}
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                id={menuId}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose}><PersonIcon style={{ margin: '10px' }} />Profile</MenuItem>
                                <MenuItem onClick={handleMenuClose}><DinnerDiningIcon style={{ margin: '10px' }} />Reservations</MenuItem>
                                <MenuItem onClick={handleMenuClose}><SettingsIcon style={{ margin: '10px' }} />Settings</MenuItem>

                                <MenuItem onClick={handleLogOut}><LogoutIcon style={{ margin: '10px' }} />Logout</MenuItem>

                            </Menu>
                        </>
                    ) : (
                        <>
                            <div>
                                <Button
                                    href="/login"
                                >
                                    <AccountCircleIcon style={{ margin: '10px' }} />
                                    Login
                                </Button>
                                <Button
                                    href="/signup"
                                >
                                    <ExitToAppIcon style={{ margin: '10px' }} />
                                    Sign Up
                                </Button>
                            </div>
                        </>
                    )
                    }
                </Toolbar>
            </AppBar>

            <Grid container style={{ marginTop: '80px', width: '100%', alignItems: "center"  }}>
                {currentUser ? (
                    <>
                        <Grid container sx={{ alignItems: "center" }}>
                          
                            <Grid item xs={12} sx={{ alignContent: "center" }}>
                                <Typography variant="h5" style={{ textAlign: 'end' }}>You have 500 Points!</Typography>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ alignItems: "center" }}>
                            <>
                                <Box
                                    component="main"
                                    sx={{
                                        flexGrow: 1,
                                        py: 3
                                    }}
                                >
                                    <Container maxWidth="lg">
                                        <Grid
                                            container
                                            spacing={3}
                                        >
                                            <Grid
                                                item
                                                lg={4}
                                                md={6}
                                                xs={12}
                                            >
                                                <AccountProfile currentuser={currentUser}/>
                                            </Grid>
                                            <Grid
                                                item
                                                lg={8}
                                                md={6}
                                                xs={12}
                                            >
                                                <AccountProfileDetails currentuser={currentUser}/>
                                            </Grid>
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