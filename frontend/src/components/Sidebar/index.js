'use client';

import GovTool from "@/assets/svgs/govTool";
import Logo from "@/assets/svgs/logo";
import { navItems } from "@/constants";
import { usePathname, useRouter } from "@/navigation";
import {
	Box,
	CssBaseline,
	Drawer,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const Sidebar = ({ drawerWidth = 340 }) => {
    const [activeItem, setActiveItem] = useState(false);

    const pathname = usePathname();
	const router = useRouter();

    const removeLangPath = (pathname) => {
		const regex = /^\/..\/(.*)$/;
		const match = pathname.match(regex);
		return match ? match[1] : pathname;
	};

    useEffect(() => {
		let list = [...navItems];
		list.map((item) => {
			if (removeLangPath(pathname) === item?.path) {
				setActiveItem(item?.path);
			}
		});
	}, [pathname]);

	return (
		<Box sx={{ display: "flex", position: "absolute", height: "100%" }}>
			<CssBaseline />
			<Drawer
				id="sidebar-drawer"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					padding: "15px",
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
						borderRadius: "16px",
						border: "none",
						boxShadow: "0px 0px 0px 0px rgba(52, 93, 200, 0.8)",
						position: "relative",
					},
					display: { xs: "none", md: "flex" },
				}}
				variant="permanent"
				anchor="left"
			>
				<Box sx={{ padding: "20px" }}>
					<Logo id="sidebar-logo" />
					<GovTool id="sidebar-logo" />
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "start",
						justifyContent: "space-between",
						height: "calc(100% - 112px)",
					}}
				>
					<List sx={{ padding: "12px", width: "100%" }}>
						{navItems.map((item) => (
							<ListItemButton
								id={item.id}
								sx={{
									"&:hover": {
										backgroundColor: "#3052F51F",
										cursor: "pointer",
										borderRadius: "100px",
									},
									height: "56px",
									display: "flex",
									alignItems: "center",
									borderRadius: "100px",
									backgroundColor:
										activeItem === item?.path
											? // ? "#3052F51F"
											  "transparent"
											: "transparent",
								}}
								key={item.name}
								onClick={() => router.push(item.path)} // Navigate to the path when clicked
								// selected={activeItem === item.path}
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
							</ListItemButton>
						))}
					</List>
				</Box>
			</Drawer>
		</Box>
	);
};

export default Sidebar;
