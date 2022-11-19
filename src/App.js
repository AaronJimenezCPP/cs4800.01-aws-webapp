import { AppBar, Button, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Paper, Select, SvgIcon, Table, TableBody, tableBodyClasses, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { ReactComponent as FlameIcon } from "./flame-icon.svg"
import { useTheme } from '@emotion/react';
import { GoogleMap, HeatmapLayer } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

function App() {
    

    return (
        <>
            <TopBar />

            <Box sx={{margin: "2rem"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={4}>
                        <California />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <PredictionInput />  

                        <Box sx={{marginTop: "1rem"}}>
                            <PredictionResults />   
                        </Box>           
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        
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
                mapContainerStyle={{width: "100%", height: "40rem"}}
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

const PredictionInput = () => {
    const theme = useTheme();
    const [date, setDate] = useState(null);

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
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            renderInput={(params) => <TextField fullWidth {...params} sx={{marginBottom: "0.8rem"}} />}
                        />
                    </LocalizationProvider>

                    <Grid container spacing={2} sx={{marginBottom: "0.8rem"}}>
                        <Grid item xs={8}>
                            <TextField 
                                fullWidth
                                label="Rainfall"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">in</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="timespan-select-label">Timespan</InputLabel>
                                <Select
                                    labelId="timespan-select-label"
                                    label="Timespan"
                                >
                                    <MenuItem value={1}>1 month</MenuItem>
                                    <MenuItem value={2}>2 months</MenuItem>
                                    <MenuItem value={3}>3 months</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Divider sx={{marginY: "0.8rem"}} />

                    <Button 
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

const History = () => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Fires/Year</TableCell>
                        <TableCell>Fires/Year</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default App;
