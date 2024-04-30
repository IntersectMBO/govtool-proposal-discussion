'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import {
	ThemeProvider,
	createTheme,
	responsiveFontSizes,
} from '@mui/material/styles';
import { Sidebar, MobileNavbar } from '@/components';
import { useAppContext } from '@/context/context';
import { usePathname } from '@/navigation';

let theme = createTheme({
	palette: {
		primary: {
			main: '#0034AE',
		}
	}
});

theme = responsiveFontSizes(theme);

function ThemeProviderWrapper({ children }) {
	const { pageBackground } = useAppContext();
	const mobileNavRef = useRef();

	const [mobileNavHeight, setMobileNavHeight] = useState(0);
	const [windowWidth, setWindowWidth] = useState(0);

	const drawerWidth = 340;
	const pathname = usePathname();

	useEffect(() => {
		if (window) {
			setWindowWidth(window?.innerWidth);
		}
		const handleResize = () => {
			setWindowWidth(window?.innerWidth);
		};

		window?.addEventListener('resize', handleResize);

		return () => window?.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (mobileNavRef?.current) {
			// To set content height the right amount because of mobile navbar
			setMobileNavHeight(mobileNavRef?.current?.offsetHeight);
		}
	}, [mobileNavRef, windowWidth]);

	return (
		<ThemeProvider theme={theme}>
			{pathname.includes('/') && (
				<Sidebar drawerWidth={drawerWidth} />
			)}
			{pathname.includes('/') && (
				<MobileNavbar ref={mobileNavRef} />
			)}
			<Box 
				component="main"
				sx={{
					flexGrow: 1,
					p: 0,
					backgroundColor: theme.palette.background.default,
					backgroundImage: pageBackground,
					backgroundSize: 'cover',
					backgroundSize: '100%',
					backgroundPosition: 'center calc(100% + 50px)',
					backgroundRepeat: 'no-repeat',
					height: {
						xs: `calc(100dvh - ${mobileNavHeight}px)`,
						md: '100dvh',
					},
					padding: pathname.includes('/dashboard')
						? {
								xs: `20px`,
								md: `20px 20px 20px ${drawerWidth + 40}px`,
							}
						: '0px',
					overflow: 'auto',
				}}
			>
				{children}
			</Box>
		</ThemeProvider>
	);
}

export default ThemeProviderWrapper;
