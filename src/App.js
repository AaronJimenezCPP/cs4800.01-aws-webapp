import { AppBar, Button, Divider, Grid, InputAdornment, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { ReactComponent as FlameIcon } from "./flame-icon.svg"
import { useTheme } from '@emotion/react';
import { GoogleMap, HeatmapLayer } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { apiAgent } from './api';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

function App() {
    useEffect(() => {
        
    }, [])

    return (
        <>
            <TopBar />

            <Box sx={{margin: "2rem"}}>
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={5}>
                        <California />
                    </Grid>

                    <Grid item xs={12} lg={3}>
                        <PredictionInput />  

                        <Box sx={{marginTop: "1rem"}}>
                            <PredictionResults />   
                        </Box>           
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <About />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

const _Store = new class {
    date = null
    rain30d = ""
    rain60d = ""
    rain90d = ""

    constructor() {
        makeAutoObservable(this)
    }

    updateDate = (newDate) => {
        this.date = newDate
    }   

    updateRain30d = (newRain30d) => {
        this.rain30d = newRain30d
    }

    updateRain60d = (newRain60d) => {
        this.rain60d = newRain60d
    }

    updateRain90d = (newRain90d) => {
        this.rain90d = newRain90d
    }

    predict = async () => {
        if (this.rain30d && this.rain60d && this.rain90d && this.date.isValid) {
            // let testResult = await apiAgent.testing.testEndpoint()
            let result = await apiAgent.fireData.predict(this.date.format("MM/DD/YYYY"), this.rain30d, this.rain60d, this.rain90d);
            console.log(result)
        }
        else {
            console.log("Some fields empty")
        }
    }
}()

const TopBar = () => {
    return (
        <AppBar position='sticky'>
            <Toolbar>
                <Grid container>
                    <SvgIcon sx={{width: "2rem", height: "2rem", marginRight: "1rem"}}>
                        <FlameIcon />
                    </SvgIcon>

                    <Typography sx={{color: "white", weight: 500, fontSize: "1.4rem", textShadow: "2px 2px 2px rgba(0,0,0,0.2)"}}>
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
    const theme = useTheme();
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
        <Box sx={{boxShadow: theme.shadows[8]}}>
            <GoogleMap 
                mapContainerStyle={{width: "100%", height: "50rem"}}
                center={{lat: 36.778259, lng: -119.417931}}
                zoom={6}
            >  
                <HeatmapLayer 
                    data={data}
                />
            </GoogleMap>
        </Box>
    )
}

const PredictionInput = observer(() => {
    const theme = useTheme();

    return (
            <Paper elevation={4} sx={{width: "100%", overflow: "hidden"}}>
                <Box sx={{marginX: "1rem"}}>
                    <Typography sx={{marginY: "0.8rem", color: "rgb(60,60,60)", fontSize: "1.4rem", lineHeight: "1.2rem", fontWeight: 600, textShadow: "2px 2px 2px rgba(40,40,40,0.2)"}}>
                        Create Prediction
                    </Typography>

                    <Divider sx={{marginY: "0.8rem"}} />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={_Store.date}
                            onChange={(newValue) => _Store.updateDate(newValue)}
                            renderInput={(params) => <TextField fullWidth {...params} sx={{marginBottom: "0.8rem"}} />}
                        />
                    </LocalizationProvider>

                    <TextField 
                        sx={{marginBottom: "0.8rem"}}
                        fullWidth
                        label="Rainfall 30d"
                        type="number"
                        value={_Store.rain30d}
                        onChange={(e) => _Store.updateRain30d(e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">in</InputAdornment>,
                        }}
                    />
            
                    <TextField 
                        sx={{marginBottom: "0.8rem"}}
                        fullWidth
                        label="Rainfall 60d"
                        type="number"
                        value={_Store.rain60d}
                        onChange={(e) => _Store.updateRain60d(e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">in</InputAdornment>,
                        }}
                    />
                
                    <TextField 
                        fullWidth
                        label="Rainfall 90d"
                        type="number"
                        value={_Store.rain90d}
                        onChange={(e) => _Store.updateRain90d(e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">in</InputAdornment>,
                        }}
                    />           

                    <Divider sx={{marginY: "0.8rem"}} />

                    <Button 
                        onClick={_Store.predict}
                        variant='contained' 
                        sx={{
                            textTransform: "none",
                            borderRadius: "12px",
                            boxShadow: theme.shadows[4],
                            marginBottom: "1rem"
                        }}
                    >
                        <Container>
                            <Grid container sx={{marginRight: "0.4rem"}}>
                                <SvgIcon sx={{width: "1.6rem", height: "1.6rem", marginRight: "0.4rem"}}>
                                    <FlameIcon />
                                </SvgIcon>

                                <Typography sx={{lineHeight: "1.6rem", fontSize: "1.4rem", color: "white", fontWeight: 600, textShadow: "2px 2px 2px rgba(0,0,0,0.4)"}}>
                                    Predict
                                </Typography>
                            </Grid>
                        </Container>
                    </Button>
                </Box>
            </Paper>
      
    )
})

const PredictionResults = () => {
    const [data, setData] = useState([])

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
        for (let i = 1; i <= 20; i++) {
            tmpData.push({
                name: "Location " + i,
                risk: riskNames[Math.floor(Math.random()*riskNames.length)]
            })
        }

        setData(tmpData)
    }, [])

    // For setting up sticky header properly
    const titleLineHeight = "1.2rem"
    const titleMarginY = "0.4rem"
    const cellPadding = "0.375rem"
    const titleBorderWidth = "2px"

    return (
        <Paper elevation={4} sx={{overflow: "hidden"}}>
            <TableContainer sx={{maxHeight: "40rem"}}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{borderColor: "rgba(0,0,0,0.3)", borderWidth: titleBorderWidth}}>
                                <Typography sx={{marginY: titleMarginY, color: "rgb(60,60,60)", fontSize: "1.4rem", lineHeight: titleLineHeight, fontWeight: 600, textShadow: "2px 2px 2px rgba(40,40,40,0.2)"}}>
                                    Prediction Results
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{top: `calc(${titleLineHeight} + 2*${titleMarginY} + 2*${cellPadding} + ${titleBorderWidth})`, borderColor: "rgba(0,0,0,0.3)", borderWidth: "2px"}}>
                                <Typography sx={{fontSize: "1rem", fontWeight: 600, color: "rgb(60,60,60)", textShadow: "2px 2px 2px rgba(40,40,40,0.2)"}}>
                                    Location
                                </Typography>
                            </TableCell>
                            <TableCell sx={{top: `calc(${titleLineHeight} + 2*${titleMarginY} + 2*${cellPadding} + ${titleBorderWidth})`, borderColor: "rgba(0,0,0,0.3)", borderWidth: "2px"}}>
                                <Typography sx={{fontSize: "1rem", fontWeight: 600, color: "rgb(60,60,60)", textShadow: "2px 2px 2px rgba(40,40,40,0.2)"}}>
                                    Risk Level
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((thisData, i) => (
                            <TableRow key={thisData.name}>
                                <TableCell>
                                    <Typography>
                                        {thisData.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {thisData.risk}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper> 
    )
}

const About = () => {
    const theme = useTheme()

    return (
        <>
            <Typography sx={{marginBottom: "1rem", color: "rgb(60,60,60)", fontSize: "1.4rem", lineHeight: "1.2rem", fontWeight: 600, textShadow: "2px 2px 2px rgba(40,40,40,0.2)"}}>
                About
            </Typography>

            <Divider sx={{marginY: "1rem"}} />

            <Typography sx={{fontSize: "1rem", lineHeight: "1.2rem"}}>
                This tool can help predict the areas in California that have the highest risk of developing wildfires. Predictions are created for specific dates and thier recent rainfall conditions.
            </Typography>

            <Typography sx={{marginTop: "1rem", fontSize: "1rem", lineHeight: "1.2rem"}}>
                It uses an AI model trained on historical weather and wildfire data.
            </Typography>

            <Divider sx={{marginY: "1rem"}} />

            <Typography sx={{fontSize: "1rem", lineHeight: "1.2rem"}}>
                Wildfires are a devastating problem that plague the state of california, and they continue to get worse every decade.
            </Typography>

            <Box
                component="img"
                src="https://eoimages.gsfc.nasa.gov/images/imagerecords/148000/148908/californiafires_map_1970-2021.png"
                sx={{width: "100%", marginTop: "1rem", boxShadow: theme.shadows[4]}}
            />
            <Typography sx={{fontSize: "0.6rem", fontHeight: "0.6rem", color: "rgba(0,0,0,0.6)"}}>
                earthobservatory.nasa.gov
            </Typography>

            <Typography sx={{marginTop: "1rem", fontSize: "1rem", lineHeight: "1.2rem"}}>
                This is largely due to historical levels of drought.
            </Typography>

            <Box
                component="img"
                src="https://eoimages.gsfc.nasa.gov/images/imagerecords/148000/148908/cadrought_usdm_2021271.png"
                sx={{width: "100%", marginTop: "1rem", boxShadow: theme.shadows[4]}}
            />
            <Typography sx={{fontSize: "0.6rem", fontHeight: "0.6rem", color: "rgba(0,0,0,0.6)"}}>
                earthobservatory.nasa.gov
            </Typography>
        </>
    )
}

export default App;
