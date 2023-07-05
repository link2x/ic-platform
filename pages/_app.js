//import '../styles/globals.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

let theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			light: '#b6ffff',
			main: '#81d4fa',
			dark: '#4ba3c7',
			contrastText: '#000',
		},
		secondary: {
			light: '#4fb3bf',
			main: '#00838f',
			dark: '#005662',
			contrastText: '#fff',
		},
		teeth: {
			light: '#ffffff',
			main: '#ffffff',
			dark: '#ffffff',
			contrastText: '#000',
		},
		gentleWarning: {
			main: '#ff9800',
			contrastText: '#000',
		},
		sensory: {
			main: '#74735a',
			contrastText: '#202007',
		},
		allergen: {
			main: '#e7ca24',
			contrastText: '#000',
		},
	}
});

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
