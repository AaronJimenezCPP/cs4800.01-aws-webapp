import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { mainTheme } from './theme';
import { ThemeProvider } from '@mui/material';
import { LoadScript } from '@react-google-maps/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <LoadScript googleMapsApiKey='AIzaSyDWpsgbVE8pajQuodWrrwjEqvhO3N2WLDw'>
        <ThemeProvider theme={mainTheme}>
            <App />
        </ThemeProvider>
    </LoadScript>

);
