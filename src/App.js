import { AppBar, Button, Divider, Grid, Paper, SvgIcon, TextField, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { ReactComponent as FlameIcon } from "./flame-icon.svg"
import { useTheme } from '@emotion/react';
import { GoogleMap } from '@react-google-maps/api';

function App() {
    

    return (
        <>
            <TopBar />

            <Box sx={{margin: "2rem"}}>
                <Grid container>
                    <Grid item lg={4}>
                        <California />
                    </Grid>

                    <Grid item lg={3}>
                        <PredictionInput />
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

const California = () => {
    return (
        <GoogleMap 
            mapContainerStyle={{width: "100%", height: "40rem"}}
            center={{lat: 36.778259, lng: -119.417931}}
            zoom={6}
        >  
            <></>
        </GoogleMap>
    )
}

const PredictionInput = () => {
    const theme = useTheme();

    const inputStyles = {
        '& label.Mui-focused': {
            color: 'rgba(255,255,255,0.8)',
        },
        
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.5)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.8)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255,255,255,0.5)',
            },
        }
    }

    return (
        <Container>
            <Paper elevation={4} sx={{width: "100%", backgroundColor: theme.palette.primary.main, overflow: "hidden"}}>
                <Box sx={{marginX: "1rem", marginTop: "0.8rem"}}>
                    <Typography textAlign="center" sx={{color: "white", fontSize: "1.4rem", fontWeight: 500, textShadow: "2px 2px rgba(0,0,0,0.2)"}}>
                        Create Prediction
                    </Typography>

                    <Divider sx={{marginY: "1rem"}} />

                    <TextField 
                        label="Date" 
                        size="small" 
                        fullWidth 
                        InputProps={{sx: {boxShadow: theme.shadows[3]}}}
                        InputLabelProps={{sx: {color: "white"}}} 
                        sx={{
                            marginBottom: "1rem",
                            ...inputStyles
                        }} 
                    />

                    <TextField 
                        label="Rainfall" 
                        size="small" 
                        fullWidth 
                        InputProps={{sx: {boxShadow: theme.shadows[3]}}}
                        InputLabelProps={{sx: {color: "white"}}} 
                        sx={{
                            marginBottom: "1rem",
                            ...inputStyles
                        }} 
                    />

                    <Button 
                        fullWidth
                        variant='contained'
                        sx={{
                            marginBottom: "1rem", 
                            textTransform: "none",
                            backgroundColor: "rgba(250,209,92,1)",
                            borderStyle: "solid",
                            borderWidth: "1px",
                            borderColor: "rgba(236,111,89,0.6)",
                            boxShadow: theme.shadows[4],
                            "&:hover": {
                                backgroundColor: "rgba(230,191,86,1)",
                                boxShadow: theme.shadows[1]
                            }
                        }}
                    >
                        <Typography sx={{fontSize: "1.2rem", lineHeight: "1.4rem", textShadow: "2px 2px rgba(236,111,89,0.2)", fontWeight: 600}}>
                            Predict!
                        </Typography>
                    </Button>
                </Box>
            </Paper>
        </Container> 
    )
}

export default App;
