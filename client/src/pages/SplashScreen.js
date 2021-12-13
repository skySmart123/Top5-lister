import {createTheme} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import {ThemeProvider} from "@emotion/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useHistory} from "react-router-dom";
import Copyright from '../component/Copyright'

export default function SplashScreen() {
    const theme = createTheme({
        palette: {
            neutral: {
                main: "#64748B",
                contrastText: "#fff",
            },
        },
    });

    const history = useHistory();

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" flexDirection="column"
                  sx={{background: 'linear-gradient(to left, #b993d6, #8ca6db)'}}>
                <CssBaseline/>
                <Grid container sx={{flexGrow: 1}}>

                    <Grid item xs={12} md={8}>
                        {/*<Item>xs=8</Item>*/}
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            <Typography
                                component="h1"
                                variant="h3"
                                padding={{xs: 2, md: 3}}
                                color="white"
                            >
                                Welcome to The Top 5 Lister
                            </Typography>
                            <Typography
                                component="h3"
                                variant="h5"
                                padding={{xs: 2, md: 3}}
                                sx={{fontStyle: "italic", maxWidth: 650, width: '100%',}}
                                color="white"
                            >
                                An application where users can list their five favorite anything
                                as well as see lists made by other users and even see the
                                aggregate top 5 lists of all users for a given category.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/*<Item>xs=4</Item>*/}
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            {/* <span style={{ cursor: "not-allowed" }}>
              <Button component={Link} disabled>
                disabled
              </Button>
            </span> */}
                            {/*<Button component={Link} href={'/login'}>Home</Button>*/}

                            <Button
                                variant="contained"
                                sx={{width: "75%", maxWidth: 300, mb: 2, textTransform: 'none'}}
                                onClick={() => {
                                    history.push('/register')
                                }}
                            >
                                Create Account
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{width: "75%", maxWidth: 300, mb: 2, textTransform: 'none'}}
                                onClick={() => {
                                    history.push('/login')
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                color="neutral"
                                variant="contained"
                                sx={{width: "75%", maxWidth: 300, textTransform: 'none'}}
                                onClick={() => {
                                    history.push('/all')
                                }}
                            >
                                Continue as Guest
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid container>
                    <Grid item xs={12}>

                        <Copyright
                            component="p"
                            variant="body"
                            color="white"
                            padding="10px"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
