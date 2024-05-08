'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Sidebar, MobileNavbar, Header } from '@/components';
import { Box } from '@mui/material';

const DefaultLayoutWrapper = ({ children }) => {
	const mobileNavRef = useRef();

	const [mobileNavHeight, setMobileNavHeight] = useState(0);
	const [windowWidth, setWindowWidth] = useState(0);

	const drawerWidth = 340;

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
		<Box>
			<Sidebar drawerWidth={drawerWidth} />

			<MobileNavbar ref={mobileNavRef} />

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 0,
					backgroundColor: (theme) =>
						theme.palette.background.default,
					height: {
						xs: `calc(100dvh - ${mobileNavHeight}px)`,
						md: '100dvh',
					},
					padding: {
						xs: `20px`,
						md: `20px 20px 20px ${drawerWidth + 40}px`,
					},

					overflow: 'auto',
				}}
			>
				<Header />
				{children}
			</Box>
		</Box>
	);
};

export default DefaultLayoutWrapper;