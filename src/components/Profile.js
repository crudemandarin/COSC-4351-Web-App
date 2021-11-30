import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { Avatar } from "@mui/material";

// Firebase Code
import AuthProvider, { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

// Account
import { AccountProfile } from "./AccountProfile";
import { AccountProfileDetails } from "./AccountProfileDetails";
import avatar from "../assets/avatar.jpg";
import eating2 from "../assets/eating2.svg";
import Navbar from "./Navbar";

export default function Profile() {
  const { currentUser, logout, login } = React.useContext(AuthContext);

  const [user, setUser] = React.useState(currentUser);

  const history = useNavigate();

  return (
    <Container
      sx={{
        width: "600px",
        display: "flex",
        width: "100%",
      }}
    >
      <Navbar parent={"profile"} />

      <Grid
        container
        style={{ marginTop: "80px", width: "100%", alignItems: "center" }}
      >
        {currentUser ? (
          <>
            <Grid container sx={{ alignItems: "center" }}>
              <Grid item xs={12} sx={{ alignContent: "center" }}>
                <Typography variant="h5" style={{ textAlign: "end" }}>
                  You have 500 Points!
                </Typography>
              </Grid>
            </Grid>

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
                      <Grid item lg={4} md={6} xs={12}>
                        <AccountProfile currentuser={currentUser} />
                        <Grid
                          item
                          sx={{
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <img
                            src={eating2}
                            style={{
                              height: 310,
                              width: 310,
                              textAlign: "center",
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item lg={8} md={6} xs={12}>
                        <AccountProfileDetails currentuser={currentUser} />
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
