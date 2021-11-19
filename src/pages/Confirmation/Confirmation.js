import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';


// Assets
import confirmation from '../../assets/confirmation.png';

// Firebase Code
import { AuthContext } from '../../contexts/AuthContext';

// History
import {
    useNavigate,
} from 'react-router-dom';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Confirmation = ({ props }) => {

    const { currentUser, logout, login } = React.useContext(AuthContext);
    const history = useNavigate();

    // Reservation Information
    let { date, time, numGuests } = props;
    date = 'Oct 11, 2021';
    time = '7:00 PM'
    numGuests = '2 People'

    const handleLogOut = () => {
        logout()
            .then(res => {
                localStorage.clear();
                history.push('/')
            })
            .catch(err => {
                console.log(err);
            });
    }


    return (
        <div style={{ overflowX: 'hidden' }}>
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

                            <Typography variant="h6" >
                                Hello {currentUser.firstName}!
                            </Typography>

                            <Button
                                size="small"

                                onClick={handleLogOut}

                            >
                                <ExitToAppIcon style={{ margin: '10px' }} />
                                LOG OUT
                            </Button>

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


            <Grid container >
                <Grid item spacing={2} xs={7} style={{ padding: '40px', marginTop: '70px' }}>
                    <Typography variant="body2" style={{ marginBottom: '20px' }}>
                        Thank you for reserving with us!
                    </Typography>
                    <Grid container>
                        <Grid item xs={4} style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',

                        }}>
                            <DateRangeIcon style={{ padding: '10px' }} />
                            {date}
                        </Grid>
                        <Grid item xs={4} style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}>
                            <AccessTimeIcon style={{ padding: '10px' }} />
                            {time}
                        </Grid>
                        <Grid item xs={4} style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}>
                            <GroupIcon style={{ padding: '10px' }} />
                            {numGuests}
                        </Grid>
                    </Grid>
                    <Paper elevation={0}
                        style={{
                            backgroundColor: '#CEF5F5',
                            padding: '15px',
                            marginBottom: '20px'
                        }}>

                        We're holding this table for you for X minutes!

                    </Paper>
                    <Divider variant="middle" spacing={3} style={{ marginBottom: '20px' }} />
                    <Typography variant="body2" style={{ marginBottom: '20px' }}>
                        Please 
                        <Link href="/login" underline="none" style={{ padding: '5px', color: '#FF6C6C' }}>
                            Sign in
                        </Link>
                         or 
                        <Link href="/signup" underline="none" style={{ padding: '5px', color: '#FF6C6C' }}>
                            Sign up 
                        </Link>
                         to collect your points and earn a free dinner on us!
                    </Typography>
                    
                    <Typography variant="body1" >
                        Contact Details
                    </Typography>

                </Grid>
                <Grid item xs={4} >

                    <img src={confirmation} style={{ height: '100%', objectPosition: '-550px' }} />

                </Grid>
            </Grid>

        </div>
    )
}

export default Confirmation