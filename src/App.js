import { AppBar, Grid, SvgIcon, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ReactComponent as FlameIcon } from "./flame-icon.svg"
import calitmp from "./cali-tmp.png"
import { useTheme } from '@emotion/react';

function App() {
    const theme = useTheme();

    return (
        <>
            <TopBar />

            <Box sx={{margin: "2rem"}}>
                <Grid container>
                    <Grid item lg={4}>
                        <Box 
                            component="img"
                            alt="California WIP"
                            src={calitmp}
                            sx={{
                                backgroundColor: "rgb(240,240,240)",
                                width: "100%",
                                padding: "2rem",
                                borderRadius: "0.5rem",
                                borderStyle: "solid",
                                borderColor: "rgb(100,100,100)",
                                borderWidth: "1px",
                                boxShadow: theme.shadows[4]
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

const TopBar = () => {
    return (
        <AppBar position='sticky'>
            <Toolbar>
                <Grid container>
                    <SvgIcon sx={{width: "2rem", height: "2rem", marginRight: "1rem"}}>
                        <FlameIcon />
                    </SvgIcon>

                    <Typography sx={{color: "white", weight: 500, fontSize: "1.4rem", textShadow: "2px 2px rgba(0,0,0,0.2)"}}>
                        California Wildfire Predictions
                    </Typography>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default App;
