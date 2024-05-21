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

			<Box>
				<Box pt={4}>
					<ProposalsList />
				</Box>

				<ProposalsList />
			</Box>
		</Box>
	);
};

export default ProposedGovernanceActions;
