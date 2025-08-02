import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ReactNode } from "react";
import GlobalStyles from "./global-styles";

const fontFamily = "'Open Sans', sans-serif"

const theme = createTheme({
    palette: {
        secondary: {
            main: '#000'
        },
        primary: {
            main: '#fd1717'
        }
    },
    typography: {
        fontFamily
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                root: () => ({
                    textTransform: 'capitalize'
                })
            }
        }
    }
});

export default function ThemeProvider ({ children }: { children: ReactNode }) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />
            {children}
        </MuiThemeProvider>
    )
}