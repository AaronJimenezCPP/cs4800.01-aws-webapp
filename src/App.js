import { AppBar, Button, Divider, Grid, Paper, SvgIcon, tableBodyClasses, TextField, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { ReactComponent as FlameIcon } from "./flame-icon.svg"
import { useTheme } from '@emotion/react';
import { GoogleMap, HeatmapLayer } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

function App() {
    

    return (
        <>
            <TopBar />

            <Box sx={{margin: "2rem"}}>
                <Grid container spacing={2}>
                    <Grid item md={12} lg={4}>
                        <California />
                    </Grid>

                    <Grid item md={12} lg={3}>
                        <PredictionInput />
                        <PredictionResults />
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

const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const negRand = () => {
    return Math.random() - 0.5
}

const California = () => {
    const [data, setData] = useState([]);

    const groupOffset = {lat: 3.5, lng: 3.5}
    const pointOffset = {lat: 0.1, lng: 0.1}
    useEffect(() => {
        let tmpData = []
        // Generate 100 groups of datapoints
        for (let i = 0; i < 100; i++) {
            // Generate center of this group
            let center = {
                lat: 36.778259 + groupOffset.lat*negRand(), 
                lng: -119.417931 + groupOffset.lng*negRand()
            }

            // 5 to 20 data points in each group
            let r = randomInt(5, 20)
            for (let j = 0; j < r; j++) {
                tmpData.push(new window.google.maps.LatLng(
                    center.lat + pointOffset.lat*negRand(), 
                    center.lng + pointOffset.lng*negRand()
                ))
            }
        }

        setData(tmpData)
    }, [])

    return (
        <GoogleMap 
            mapContainerStyle={{width: "100%", height: "40rem"}}
            center={{lat: 36.778259, lng: -119.417931}}
            zoom={6}
        >  
            <HeatmapLayer 
                data={data}
            />
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

const PredictionResults = () => {
    const [data, setData] = useState([])
    const theme = useTheme()

    const riskNames = [
        "None",
        "Very Low",
        "Low",
        "Mild",
        "Moderate",
        "High",
        "Very High",
        "Severe"
    ]

    useEffect(() => {
        let tmpData = []
        for (let i = 1; i <= 58; i++) {
            tmpData.push({
                name: "County" + i,
                risk: riskNames[Math.floor(Math.random()*riskNames.length)]
            })
        }

        setData(tmpData)
    }, [])

    return (
        <Container>
            <Box
                sx={{
                    maxHeight: "40rem",
                    overflow: "auto",
                    marginTop: "1rem",
                    borderRadius: "0.5rem",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    boxShadow: theme.shadows[4],
                    borderColor: theme.palette.primary.main
                }}
            >
                <Typography textAlign="center" sx={{fontSize: "1.4rem", marginY: "0.4rem", color: theme.palette.primary.dark, textShadow: "2px 2px rgba(0,0,0,0.1)"}}>
                    Prediction results
                </Typography>

                <Container>
                    <Divider sx={{borderColor: theme.palette.primary.main}} />

                    <Grid container justifyContent="space-between" sx={{marginY: "0.4rem"}}>
                        <Typography sx={{fontWeight: 600, textShadow: "2px 2px rgba(0,0,0,0.1)"}}>
                            County Name
                        </Typography>
                        <Typography sx={{fontWeight: 600, textShadow: "2px 2px rgba(0,0,0,0.1)"}}>
                            Risk Level
                        </Typography>
                    </Grid>

                    <Divider sx={{borderColor: theme.palette.primary.main}} />

                    {data.map((thisData, i) => (
                        <>
                            <Grid container justifyContent="space-between" sx={{marginY: "0.2rem"}}>
                                <Typography>
                                    {thisData.name}
                                </Typography>
                                <Typography>
                                    {thisData.risk}
                                </Typography>
                            </Grid>

                            <Divider />
                        </> 
                    ))}
                </Container>
                
            </Box>
        </Container>
        
    )
}

export default App;
