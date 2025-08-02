import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export default function GlobalStyles () {
    const inputGlobalStyles = (
        <MuiGlobalStyles
            styles={{
                '*': {
                    boxSizing: 'border-box',
                    padding: 0,
                    margin: 0,
                    fontFamily: "'Open Sans', sans-serif",
                },
                body: {
                    maxWidth: '100vw',
                    overflowX: 'hidden',
                },
                html: {
                    maxWidth: '100vw',
                    overflowX: 'hidden',
                },
            }}
        />
    );

    return inputGlobalStyles;
}