'use client';

import { useEffect, useState, useRef } from 'react';
import { ProposalsList } from '@/components';
import { getProposals } from '@/lib/api';
import { useTheme } from '@emotion/react';
import {
	IconFilter,
	IconSearch,
	IconSort,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
	Box,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';

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
			<Grid container spacing={3} flexDirection={'column'}>
				<Grid item display={'flex'} flexDirection={'row'} xs={12}>
					<Grid
						container
						alignItems={'center'}
						justifyContent={'space-between'}
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
							<Box gap={1} display={'flex'}>
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
			</Grid>
			{!loading ? (
				proposals?.length > 0 ? (
					<Box>
						<Box pt={4}>
							<ProposalsList proposals={proposals} />
						</Box>

						<ProposalsList proposals={proposals} />
					</Box>
				) : (
					<Typography variant="h5">No proposals found</Typography>
				)
			) : (
				<Box display={'flex'} flexDirection={'row'}>
					<Typography variant="h5">Loading...</Typography>
				</Box>
			)}
		</Box>
	);
};

export default ProposedGovernanceActions;
