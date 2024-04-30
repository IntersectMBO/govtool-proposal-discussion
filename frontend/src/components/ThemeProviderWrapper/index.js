'use client';

import { Box } from '@mui/material';
import {
	ThemeProvider,
	createTheme,
	responsiveFontSizes,
} from '@mui/material/styles';

let theme = createTheme({

});

theme = responsiveFontSizes(theme);

function ThemeProviderWrapper({ children }) {
	return (
		<ThemeProvider theme={theme}>
			<Box component="main">
				{children}
			</Box>
		</ThemeProvider>
	);
}

export default ThemeProviderWrapper;
