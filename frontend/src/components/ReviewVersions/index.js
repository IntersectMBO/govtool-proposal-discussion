'use client';

import {
	Dialog,
	Box,
	Button,
	Card,
	CardContent,
	Typography,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Link,
	IconButton,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import {
	IconCheveronLeft,
	IconArchive,
	IconLink,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { formatIsoDate, formatIsoTime } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getProposals } from '@/lib/api';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: {
		xs: '90%',
		sm: '50%',
		md: '30%',
	},
	bgcolor: 'background.paper',
	boxShadow: 24,
	borderRadius: '20px',
};

const ReviewVersions = ({ open, onClose, proposalId }) => {
	const theme = useTheme();
	const [versions, setVersions] = useState(null);
	const [selectedVersion, setSelectedVersion] = useState(null);
	const [openVersionsList, setOpenVersionsList] = useState(false);

	const isSmallScreen = useMediaQuery((theme) =>
		theme.breakpoints.down('sm')
	);

	const handleOpenVersionsList = () => setOpenVersionsList(true);
	const handleCloseVersionsList = () => setOpenVersionsList(false);

	const fetchVersions = async () => {
		try {
			let query = `filters[$and][0][prop_id]=${proposalId}&pagination[page]=1&pagination[pageSize]=25&sort[createdAt]=desc&populate[0]=proposal_links`;
			const { proposals } = await getProposals(query);
			if (!proposals) return;

			setVersions(proposals);
			setSelectedVersion(proposals[0]);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (open) {
			fetchVersions();
		}
	}, [open]);

	return (
		<Box>
			<Dialog fullScreen open={open} onClose={onClose}>
				{isSmallScreen && openVersionsList ? (
					<Grid>
						{' '}
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-start',
								gap: 1,
								borderBottom: `1px solid ${theme.palette.border.lightGray}`,
								pl: 2,
								pb: 1,
								m: 1,
							}}
						>
							<IconArchive height="24px" width="24px" />
							<Typography variant="subtitle1">
								Versions
							</Typography>
						</Box>
						<List>
							{versions?.map((version, index) => (
								<ListItem
									key={
										version?.attributes?.content?.id ||
										index
									}
									disablePadding
									sx={{
										backgroundColor:
											version?.attributes?.content?.id ===
											selectedVersion?.attributes?.content
												?.id
												? theme.palette.highlight
														.blueGray
												: 'transparent',
									}}
								>
									<ListItemButton
										onClick={() => {
											setSelectedVersion(version);
											handleCloseVersionsList();
										}}
									>
										<ListItemText
											primary={
												<Box>
													{`${formatIsoDate(
														version?.attributes
															?.content
															?.attributes
															?.createdAt
													)}  ${formatIsoTime(
														version?.attributes
															?.content
															?.attributes
															?.createdAt
													)} ${
														version?.attributes
															?.content
															?.attributes
															?.prop_rev_active
															? ' (Live)'
															: ''
													}`}
												</Box>
											}
										/>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</Grid>
				) : (
					<Grid
						sx={{
							display: 'flex',
							flexDirection: 'column',
							flexGrow: 1,
							backgroundImage: `url('/svg/ellipse-version-1.svg'), url('/svg/ellipse-version-2.svg')`,
							backgroundRepeat: 'no-repeat, no-repeat',
							backgroundPosition: 'top left, bottom right',
							backgroundSize: 'auto, auto',
							overflow: 'auto',
							minHeight: 0,
						}}
					>
						<Grid
							item
							sx={{
								paddingLeft: '20px',
								borderBottom: `1px solid ${theme.palette.border.gray}`,
								mt: 2,
							}}
						>
							<Typography
								variant="h4"
								component="h1"
								gutterBottom
							>
								View Versions
							</Typography>
						</Grid>
						<Grid item mt={2} mb={2}>
							<Button
								size="small"
								startIcon={
									<IconCheveronLeft
										width="18"
										height="18"
										fill={theme.palette.primary.main}
									/>
								}
								onClick={onClose}
							>
								Back
							</Button>
						</Grid>

						<Grid
							item
							display="flex"
							justifyContent="center"
							alignContent="center"
						>
							{isSmallScreen ? null : (
								<Grid item xs={12} md={4}>
									<Card
										sx={{
											overflow: 'hidden',
											boxShadow: 1,
											borderRadius: '20px',
											ml: 4,
										}}
									>
										<CardContent
											sx={{
												p: 0,
												maxWidth: '200px',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'row',
													justifyContent:
														'flex-start',
													gap: 1,
													borderBottom: `1px solid ${theme.palette.border.lightGray}`,
													pl: 2,
													pb: 1,
													m: 1,
												}}
											>
												<IconArchive
													height="24px"
													width="24px"
												/>
												<Typography variant="subtitle1">
													Versions
												</Typography>
											</Box>
											{/* Versions */}
											<List>
												{versions?.map(
													(version, index) => (
														<ListItem
															key={
																version
																	?.attributes
																	?.content
																	?.id ||
																index
															}
															disablePadding
															sx={{
																backgroundColor:
																	version
																		?.attributes
																		?.content
																		?.id ===
																	selectedVersion
																		?.attributes
																		?.content
																		?.id
																		? theme
																				.palette
																				.highlight
																				.blueGray
																		: 'transparent',
															}}
														>
															<ListItemButton
																onClick={() =>
																	setSelectedVersion(
																		version
																	)
																}
															>
																<ListItemText
																	primary={
																		<>
																			<div>
																				{`${formatIsoDate(
																					version
																						?.attributes
																						?.content
																						?.attributes
																						?.createdAt
																				)}${
																					version
																						?.attributes
																						?.content
																						?.attributes
																						?.prop_rev_active
																						? ' (Live)'
																						: ''
																				}`}
																			</div>
																			<div>
																				{formatIsoTime(
																					version
																						?.attributes
																						?.content
																						?.attributes
																						?.createdAt
																				)}
																			</div>
																		</>
																	}
																/>
															</ListItemButton>
														</ListItem>
													)
												)}
											</List>
										</CardContent>
									</Card>
								</Grid>
							)}
							{/* Selected version content */}
							<Grid
								xs={8}
								item
								zIndex={1}
								maxWidth="940px"
								width="100%"
								sx={{
									mr: {
										xs: 1,
										md: 2,
									},
								}}
							>
								<Card
									variant="outlined"
									sx={{
										boxShadow: 1,
										borderRadius: '20px',
										mb: 2,
										ml: 2,
										maxWidth: '910px',
									}}
								>
									<CardContent>
										<Box
											display="flex"
											flexDirection="column"
											gap={2}
										>
											<Typography
												variant="h5"
												gutterBottom
											>
												{
													selectedVersion?.attributes
														?.content?.attributes
														?.prop_name
												}
											</Typography>
											{isSmallScreen ? (
												<Box>
													<Typography
														variant="body1"
														color={
															theme.palette.text
																.grey
														}
													>
														Version Date
													</Typography>
													<Typography
														variant="body1"
														gutterBottom
													>
														{`${formatIsoDate(
															selectedVersion
																?.attributes
																?.content
																?.attributes
																?.createdAt
														)}${
															selectedVersion
																?.attributes
																?.content
																?.attributes
																?.prop_rev_active
																? ' (Live)'
																: ''
														}`}
													</Typography>
												</Box>
											) : null}
											<Box>
												<Typography
													variant="body1"
													color={
														theme.palette.text.grey
													}
												>
													Goverance Action Type
												</Typography>
												<Typography
													variant="body1"
													gutterBottom
												>
													{
														selectedVersion
															?.attributes
															?.content
															?.attributes
															?.gov_action_type
															?.attributes
															?.gov_action_type_name
													}
												</Typography>
											</Box>
											<Box>
												<Typography
													variant="body1"
													color={
														theme.palette.text.grey
													}
												>
													Abstract
												</Typography>
												<Typography
													variant="body1"
													gutterBottom
												>
													{
														selectedVersion
															?.attributes
															?.content
															?.attributes
															?.prop_abstract
													}
												</Typography>
											</Box>
											<Box>
												<Typography
													variant="body1"
													color={
														theme.palette.text.grey
													}
												>
													Motivation
												</Typography>
												<Typography
													variant="body1"
													gutterBottom
												>
													{
														selectedVersion
															?.attributes
															?.content
															?.attributes
															?.prop_motivation
													}
												</Typography>
											</Box>
											<Box>
												<Typography
													variant="body1"
													color={
														theme.palette.text.grey
													}
												>
													Rationale
												</Typography>
												<Typography
													variant="body1"
													gutterBottom
												>
													{
														selectedVersion
															?.attributes
															?.content
															?.attributes
															?.prop_rationale
													}
												</Typography>
											</Box>
											<Box>
												<Typography
													variant="body1"
													color={
														theme.palette.text.grey
													}
												>
													Supporting links
												</Typography>
												<Box
													display="flex"
													flexDirection={
														isSmallScreen
															? 'column'
															: 'row'
													}
													flexWrap="wrap"
													gap={2}
												>
													{selectedVersion?.attributes?.content?.attributes?.proposal_links?.map(
														(link, index) => (
															<Box
																key={index}
																display="flex"
																flexDirection="row"
																alignItems="center"
																component={Link}
																href={
																	link?.prop_link
																}
																target="_blank"
																rel="noopener noreferrer"
																sx={{
																	textDecoration:
																		'none',
																}}
															>
																<Box mr={0.5}>
																	<IconLink
																		fill={
																			theme
																				.palette
																				.primary
																				.main
																		}
																	/>
																</Box>
																<Typography
																	variant="body1"
																	component="span"
																>
																	{
																		link?.prop_link_text
																	}
																</Typography>
															</Box>
														)
													)}
												</Box>
											</Box>
										</Box>

										<Box
											sx={{
												display: 'flex',
												flexDirection: isSmallScreen
													? 'column'
													: 'row',
												justifyContent: 'space-between',
												mt: 10,
											}}
										>
											<Box>
												<Button
													variant="outlined"
													sx={{
														borderRadius: '20px',
														mb: {
															xs: 2,
															md: 0,
														},
													}}
													onClick={onClose}
												>
													Back to Proposal
												</Button>
											</Box>
										</Box>
									</CardContent>
								</Card>
							</Grid>

							{isSmallScreen ? (
								<Grid xs={2} item>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor:
												theme.palette.iconButton
													.lightPeriwinkle,
											borderRadius: '16px',
											width: '40px',
											height: '40px',
											mr: 2,
											boxShadow: 2,
										}}
									>
										<IconButton
											onClick={handleOpenVersionsList}
										>
											<IconArchive />
										</IconButton>
									</Box>
								</Grid>
							) : null}
						</Grid>
					</Grid>
				)}
			</Dialog>
		</Box>
	);
};

export default ReviewVersions;
