"use client";
import { ProposalCard } from "@/components";
import { getProposals } from "@/lib/api";
import { useTheme } from "@emotion/react";
import {
	IconFilter,
	IconSearch,
	IconSort,
} from "@intersect.mbo/intersectmbo.org-icons-set";
import {
	Box,
	Button,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const ProposedGovernanceActions = () => {
	const theme = useTheme();

	const [proposals, setProposals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [mounted, setMounted] = useState(false);

	const fetchProposals = async () => {
		setLoading(true);
		try {
			const response = await getProposals();
			if (!response) return;

			let data = [...response];
			let filteredData = data?.filter(
				(proposal) => !!proposal?.attributes?.content
			);

			setProposals(filteredData);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		} else {
			fetchProposals();
		}
	}, [mounted]);
	return (
		<Box sx={{ mt: 3 }}>
			<Grid container spacing={3} flexDirection={"column"}>
				<Grid item display={"flex"} flexDirection={"row"} xs={12}>
					<Grid
						container
						alignItems={"center"}
						justifyContent={"space-between"}
						spacing={1}
					>
						<Grid item md={6} sx={{ flexGrow: { xs: 1 } }}>
							<TextField
								fullWidth
								id="outlined-basic"
								placeholder="Search..."
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<IconSearch
												color={
													theme.palette.primary.icons
														.black
												}
											/>
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item>
							<Box gap={1} display={"flex"}>
								<IconButton>
									<IconFilter
										color={
											theme.palette.primary.icons.black
										}
									/>
								</IconButton>
								<IconButton>
									<IconSort
										color={
											theme.palette.primary.icons.black
										}
									/>
								</IconButton>
							</Box>
						</Grid>
					</Grid>
				</Grid>
				{!loading ? (
					proposals?.length > 0 ? (
						<>
							<Grid item>
								<Box
									gap={2}
									display={"flex"}
									alignItems={"center"}
								>
									<Typography
										variant="h5"
										component="h2"
										color="text.black"
									>
										Info
									</Typography>
									<Button variant="outlined">Show all</Button>
								</Box>
							</Grid>
							<Grid item>
								<Grid container spacing={3}>
									{proposals?.map((proposal, index) => (
										<Grid
											item
											key={`${proposal?.id}-${index}-${proposal?.attributes?.prop_name}`}
											display={"flex"}
											xs={12}
											md={6}
											lg
										>
											<ProposalCard proposal={proposal} />
										</Grid>
									))}
								</Grid>
							</Grid>
							<Grid item>
								<Box
									gap={2}
									display={"flex"}
									alignItems={"center"}
								>
									<Typography
										variant="h5"
										component="h2"
										color="text.black"
									>
										Info
									</Typography>
									<Button variant="outlined">Show all</Button>
								</Box>
							</Grid>
							<Grid item>
								<Grid container spacing={3}>
									{proposals?.map((proposal, index) => (
										<Grid
											item
											key={`${proposal?.id}-${index}-${proposal?.attributes?.prop_name}`}
											display={"flex"}
											xs={12}
											md={6}
											lg
										>
											<ProposalCard proposal={proposal} />
										</Grid>
									))}
								</Grid>
							</Grid>
						</>
					) : (
						<Typography variant="h5">No proposals found</Typography>
					)
				) : (
					<Grid item display={"flex"} flexDirection={"row"} xs={12}>
						<Typography variant="h5">Loading...</Typography>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

export default ProposedGovernanceActions;
