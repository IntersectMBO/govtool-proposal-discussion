'use client';

import React from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	IconButton,
	Typography,
	TextField,
} from '@mui/material';

import {
	IconDotsVertical,
	IconLink,
	IconSort,
	IconCheveronLeft,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
import proposalContent from './proposal-content.json';
const ProposalPage = ({ params: { id } }) => {
	const theme = useTheme();
	return (
		<Box>
			<Box mt={4}>
				<Button
					startIcon={
						<IconCheveronLeft
							width="18"
							height="18"
							fill={theme.palette.primary.main}
						/>
					}
				>
					Show all
				</Button>
			</Box>

			<Box mt={4}>
				<Card variant="outlined">
					<Box textAlign="center">
						<Typography variant="caption">
							Proposed on: 28 May 2023
						</Typography>
					</Box>
					<CardContent>
						<Box
							display="flex"
							alignItems="center"
							justifyContent="space-between"
							flexDirection={{ xs: 'column', sm: 'row' }}
						>
							<Box
								textAlign={{
									xs: 'center',
									sm: 'left',
								}}
							>
								<Typography variant="body2">
									Your Action:
								</Typography>
								<Typography variant="caption">
									If your are ready, submit this
									proposalContent as a governance action to
									get voted on
								</Typography>
							</Box>

							<Box>
								<Button variant="outlined">
									Submit as Governance Action
								</Button>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>

			<Box mt={4}>
				<Card>
					<CardContent>
						<Grid container>
							<Grid item xs={11}>
								<Typography variant="h4" component="h2">
									{proposalContent?.attributes?.prop_name}
								</Typography>
							</Grid>

							<Grid
								item
								xs={1}
								display="flex"
								justifyContent="flex-end"
							>
								<IconButton
									sx={{
										width: 40,
										height: 40,
									}}
								>
									<IconDotsVertical width="24" height="24" />
								</IconButton>
							</Grid>
						</Grid>

						<Box mt={2}>
							<Typography variant="caption">
								Governance Action Type
							</Typography>
							<Typography variant="body2">
								{
									proposalContent?.attributes?.gov_action_type
										?.gov_action_type_name
								}
							</Typography>
						</Box>

						<Box
							mt={2}
							display="flex"
							alignItems="center"
							justifyContent="space-between"
						>
							<Typography variant="caption">
								Last Edit:{' '}
								{proposalContent?.attributes?.createdAt}
							</Typography>
							<Button
								variant="outlined"
								startIcon={
									<IconLink
										fill={theme.palette.primary.main}
										width="18"
										height="18"
									/>
								}
							>
								Review Versions
							</Button>
						</Box>

						<Box mt={4}>
							<Typography variant="caption">Abstract</Typography>
							<Typography variant="body2">
								{proposalContent?.attributes?.prop_abstract}
							</Typography>
						</Box>
						<Box mt={4}>
							<Typography variant="caption">
								Motivation
							</Typography>
							<Typography variant="body2">
								{proposalContent?.attributes?.prop_motivation}
							</Typography>
						</Box>
						<Box mt={4}>
							<Typography variant="caption">Rationale</Typography>
							<Typography variant="body2">
								{proposalContent?.attributes?.prop_rationale}
							</Typography>
						</Box>

						<Box mt={4}>
							<Typography variant="caption">
								Supporting links
							</Typography>

							<Box>
								{['Feedback', 'Link Name'].map(
									(item, index) => (
										<Button
											key={index}
											sx={{
												marginRight: 2,
												marginBottom: 2,
											}}
											startIcon={
												<IconLink
													width="18"
													height="18"
													fill={
														theme.palette.primary
															.main
													}
												/>
											}
										>
											{item}
										</Button>
									)
								)}
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Box>

			<Box
				mt={4}
				display="flex"
				alignItems="center"
				justifyContent="space-between"
			>
				<Typography variant="h4" component="h3">
					Comments
				</Typography>

				<IconButton
					sx={{
						width: 40,
						height: 40,
					}}
				>
					<IconSort
						width="24"
						height="24"
						fill={theme.palette.primary.main}
					/>
				</IconButton>
			</Box>

			<Box mt={4}>
				<Card>
					<CardContent>
						<Typography variant="body1">
							Do you want to check if your proposalContent is
							ready to be submitted as a Governance Action?
						</Typography>

						<Typography variant="body2">
							Poll will be pinned to top of your comments list.
							You can close poll any time you like. Every next
							poll will close previous one. Previous polls will be
							displayed as a comment in the comments feed.
						</Typography>

						<Box mt={2} display="flex" justifyContent="flex-end">
							<Button variant="contained">Add Poll</Button>
						</Box>
					</CardContent>
				</Card>
			</Box>

			<Box mt={4}>
				<Card>
					<CardContent>
						<Typography variant="subtitle1">
							Submit a comment
						</Typography>

						<TextField
							fullWidth
							margin="normal"
							variant="outlined"
							multiline={true}
							helperText="Supporting text"
						/>

						<Box mt={2} display="flex" justifyContent="flex-end">
							<Button variant="contained">Comment</Button>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export default ProposalPage;
