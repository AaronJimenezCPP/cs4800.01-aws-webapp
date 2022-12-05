import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { mainTheme } from './theme';
import { ThemeProvider } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={["visualization"]}>
        <ThemeProvider theme={mainTheme}>
            <App />
        </ThemeProvider>
    </LoadScript>

);
