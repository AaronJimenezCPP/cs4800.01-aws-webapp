import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { mainTheme } from './theme';
import { ThemeProvider } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={mainTheme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
