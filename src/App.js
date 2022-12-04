import { AppBar, Button, CircularProgress, Divider, Grid, InputAdornment, Paper, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
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
        _Store.loadLocations()
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

    loadingPrediction = false
    unfilledError = false

    prediction = []
    locations = {}

    constructor() {
        makeAutoObservable(this)
    }

    loadLocations = async () => {
        try {
            let result = await apiAgent.fireData.allLocations()
            if (result) {
                this.locations = result.reduce((transform, thisRecord) => {
                    transform[thisRecord[0]] = {
                        id: thisRecord[0],
                        lat: thisRecord[1],
                        lng: thisRecord[2],
                        name: thisRecord[3]
                    }
    
                    return transform
                }, {})
            }
        }
        catch (e) {
            console.log(e)
        }  
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
        this.unfilledError = false
        this.loadingPrediction = true
        if (this.rain30d && this.rain60d && this.rain90d && this.date && this.date.isValid()) {
            try {
                let result = await apiAgent.fireData.predict(this.date.format("MM/DD/YYYY"), this.rain30d, this.rain60d, this.rain90d);
                if (result) {
                    this.prediction = result.reduce((transform, thisRecord) => {
                        transform.push({
                            location: this.locations[thisRecord[0]],
                            risk: thisRecord[1]
                        })

                        return transform;
                    }, []).sort((a, b) => {
                        return a.location.name.localeCompare(b.location.name)
                    })

                    console.log(this.prediction)
                }
            }
            catch (e) {
                console.log(e)
            }
        }
        else {
            this.unfilledError = true
        }

        this.loadingPrediction = false
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

const California = observer(() => {
    const theme = useTheme();

    return (
        <Box sx={{boxShadow: theme.shadows[8]}}>
            <GoogleMap 
                mapContainerStyle={{width: "100%", height: "50rem"}}
                center={{lat: 36.778259, lng: -119.417931}}
                zoom={6}
            >  
                <HeatmapLayer 
                    data={_Store.prediction.map((thisRecord) => {
                        return {
                            weight: thisRecord.risk ** 2,
                            location: new window.google.maps.LatLng(
                                thisRecord.location.lat, 
                                thisRecord.location.lng
                            )
                        }
                    })}
                    options={{radius: 15}}
                />
            </GoogleMap>
        </Box>
    )
})

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
                            
                            renderInput={(params) => <TextField fullWidth {...params} sx={{marginBottom: "0.8rem"}} error={_Store.unfilledError && (!_Store.date || !_Store.date.isValid())} />}
                        />
                    </LocalizationProvider>

                    <TextField 
                        sx={{marginBottom: "0.8rem"}}
                        fullWidth
                        label="Rainfall 30d"
                        type="number"
                        value={_Store.rain30d}
                        onChange={(e) => _Store.updateRain30d(e.target.value)}
                        error={_Store.unfilledError && !_Store.rain30d}
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
                        error={_Store.unfilledError && !_Store.rain60d}
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
                        error={_Store.unfilledError && !_Store.rain90d}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">in</InputAdornment>,
                        }}
                    />   

                    {_Store.unfilledError && !(_Store.rain30d && _Store.rain60d && _Store.rain90d && _Store.date && _Store.date.isValid()) && (
                        <Typography sx={{color: "rgb(200, 20, 20)", fontSize: "0.8rem", marginBottom: "-0.8rem", marginTop: "0.8rem", textShadow: "1px 1px 1px rgba(0,0,0,0.3)"}}>
                            Fill in all fields to make a prediction    
                        </Typography> 
                    )}       

                    <Divider sx={{marginY: "0.8rem"}} />

                    <Grid container>
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

                        {_Store.loadingPrediction && (<CircularProgress sx={{marginLeft: "1rem"}} />)}
                    </Grid>
                </Box>
            </Paper>
      
    )
})

const PredictionResults = observer(() => {
    const riskNames = [
        {name: "None", cutoff: 0.05},
        {name: "Very Low", cutoff: 0.15},
        {name: "Low", cutoff: 0.30},
        {name: "Mild", cutoff: 0.45},
        {name: "Moderate", cutoff: 0.6},
        {name: "High", cutoff: 0.75},
        {name: "Very High", cutoff: 0.9},
        {name: "Severe", cutoff: 1}
    ]

    const riskToString = (risk) => {
        for (let i = 0; i < riskNames.length; i++) {
            if (risk <= riskNames[i].cutoff) return riskNames[i].name;
        }

        return "N/A"
    }

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
                        {_Store.prediction.map((thisRecord, i) => (
                            <TableRow key={thisRecord.location.id}>
                                <TableCell>
                                    <Typography>
                                        {thisRecord.location.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {riskToString(thisRecord.risk)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper> 
    )
})

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
