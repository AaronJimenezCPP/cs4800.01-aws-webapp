import { AppBar, Grid, SvgIcon, Toolbar, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { ReactComponent as FlameIcon } from "./flame-icon.svg"

function App() {
    return (
        <>
            <TopBar />

            <Typography>
                Hello
            </Typography>
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
