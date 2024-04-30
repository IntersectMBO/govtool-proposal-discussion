'use client';
import Logo from '@/assets/svgs/logo';
import GovTool from '@/assets/svgs/govTool';
import { navItems } from '@/constants';
import { usePathname, useRouter } from '@/navigation';
import {
	AppBar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	Button
} from '@mui/material';
import { forwardRef, useState } from 'react';
import { IconMenu, IconPlusCircle} from '@intersect.mbo/intersectmbo.org-icons-set';
import { useMediaQuery } from '@mui/material';


const MobileNavbar = forwardRef((props, ref) => {
	const pathname = usePathname();
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);

	const isTablet = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'));

	const removeLangPath = (pathname) => {
		const regex = /^\/..\/(.*)$/;
		const match = pathname.match(regex);
		return match ? match[1] : pathname;
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: 'center', height: '100%' }}
		>
			<Box sx={{ padding: '20px' }}>
				<Logo />
				<GovTool />
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'start',
					justifyContent: 'space-between',
					height: 'calc(100% - 150px)',
				}}
			>
				<List sx={{ padding: '12px', width: '100%' }}>
					{navItems.map((item) => (
						<ListItem
							sx={{
								'&:hover': {
									backgroundColor: '#3052F51F',
									cursor: 'pointer',
									borderRadius: '100px',
								},
								height: '56px',
								display: 'flex',
								alignItems: 'center',
								borderRadius: '100px',
								backgroundColor:
									removeLangPath(pathname) === item.path
										? '#3052F51F'
										: 'transparent',
								marginBottom: '8px',
							}}
							key={item.name}
							onClick={() => router.push(item.path)} // Navigate to the path when clicked
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText
								primary={
									<Typography
										variant="body1"
										sx={{
											color: (theme) =>
												theme.palette.text.black,
										}}
									>
										{item.name}
									</Typography>
								}
							/>
						</ListItem>
					))}
				</List>
			</Box>
		</Box>
	);

	return (
		<AppBar
			position="static"
			sx={{
				display: { xs: 'flex', md: 'none' },
				background: 'transparent',
			}}
			ref={ref}
		>
			<Toolbar
				disableGutters
				sx={{
					justifyContent: 'space-between',
					px: 2,
					py: 1,
				}}
			>
				<Box>
					<Logo />
					{isTablet && <GovTool />}
				</Box>

				<Box>
					<Button 
						variant='contained' 
						color='primary' 
						sx={{
							borderRadius: '30px',
							marginRight: 2
						}}
						startIcon={<IconPlusCircle fill='white'/> }
					>
						{isTablet ? 'Propose a Governance Action' : 'Propose a GA'}
					</Button>

					<IconButton
						size="large"
						edge="start"
						aria-label="open drawer"
						onClick={handleDrawerToggle}
						color="black"
					>
						<IconMenu />
					</IconButton>

					<Drawer
						anchor="left"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{ keepMounted: true }}
					>
						{drawer}
					</Drawer>
				</Box>

				

				
			</Toolbar>
		</AppBar>
	);
});

export default MobileNavbar;
