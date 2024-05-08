'use client';
import { useTheme } from "@emotion/react";
import { IconQuestionMarkCircle } from "@intersect.mbo/intersectmbo.org-icons-set";
import { Box, Button, Grid, Typography } from "@mui/material";
const Footer = (props) => {
	const theme = useTheme();
	return (
		<Grid container {...props} spacing={2} alignItems={"center"}>
			<Grid item xs={12} sm={6} md={4}>
				<Typography variant="body1">© 2024 Intersect MBO</Typography>
			</Grid>

			<Grid item xs={12} sm={6} md={4}>
				<Box
					display={"flex"}
					justifyContent={{
						xs: "flex-start",
						sm: "flex-end",
						md: "center",
					}}
				>
					<Button
						sx={{
							mr: 2,
						}}
					>
						Privacy policy
					</Button>
					<Button>Terms of service</Button>
				</Box>
			</Grid>

			<Grid item xs={12} sm={12} md={4}>
				<Box
					display="flex"
					justifyContent={{
						xs: "flex-start",
						md: "flex-end",
					}}
				>
					<Button
						sx={{
							mr: 2,
						}}
						startIcon={
							<IconQuestionMarkCircle
								width="18"
								height="18"
								fill={theme.palette.primary.main}
							/>
						}
					>
						Help
					</Button>
					<Button variant="outlined">Feedback</Button>
				</Box>
			</Grid>
		</Grid>
	);
};

export default Footer;
