import { createTheme } from "@mui/material";

// Material UI custom theming
export const mainTheme = createTheme({
    palette: {
        primary: {
            main: "rgb(25,200,75)",
        }
    },

    typography: {
        fontFamily: '"Roboto Slab", "Roboto", "Helvetica", "Arial", "sans-serif"'
    }
})