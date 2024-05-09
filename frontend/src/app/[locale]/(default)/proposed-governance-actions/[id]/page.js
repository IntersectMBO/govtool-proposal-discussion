'use client';

import {
	Badge,
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";

import { getSingleProposal } from "@/lib/api";
import { formatIsoDate } from "@/lib/utils";
import { Link } from "@/navigation";
import { useTheme } from "@emotion/react";
import {
	IconChatAlt,
	IconCheveronLeft,
	IconDotsVertical,
	IconLink,
	IconSort,
	IconThumbDown,
	IconThumbUp,
} from "@intersect.mbo/intersectmbo.org-icons-set";
import { useEffect, useState } from "react";
const ProposalPage = ({ params: { id } }) => {
	const theme = useTheme();
	const [proposal, setProposal] = useState(null);
	const [mounted, setMounted] = useState(false);

	const fetchProposal = async () => {
		try {
			const response = await getSingleProposal();
			if (!response) return;
			setProposal(response);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		} else {
			fetchProposal();
		}
	}, [id, mounted]);
	return (
		<Box>
			<Box mt={3}>
				<Button
					startIcon={
						<IconCheveronLeft
							width="18"
							height="18"
							fill={theme.palette.primary.main}
						/>
					}
					component={Link}
					href="/proposed-governance-actions"
				>
					Show all
				</Button>
			</Box>

			<Box mt={4}>
				<Card variant="outlined">
					<Box textAlign="center">
						<Typography variant="caption">
							{`Proposed on: ${formatIsoDate(
								proposal?.attributes?.createdAt
							)}`}
						</Typography>
					</Box>
					<CardContent>
						<Box
							display="flex"
							alignItems="center"
							justifyContent="space-between"
							flexDirection={{ xs: "column", sm: "row" }}
						>
							<Box
								textAlign={{
									xs: "center",
									sm: "left",
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
									{proposal?.attributes?.prop_name}
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
									proposal?.attributes?.gov_action_type
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
								{`Last Edit: ${formatIsoDate(
									proposal?.attributes?.createdAt
								)}`}
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
								{proposal?.attributes?.prop_abstract}
							</Typography>
						</Box>
						<Box mt={4}>
							<Typography variant="caption">
								Motivation
							</Typography>
							<Typography variant="body2">
								{proposal?.attributes?.prop_motivation}
							</Typography>
						</Box>
						<Box mt={4}>
							<Typography variant="caption">Rationale</Typography>
							<Typography variant="body2">
								{proposal?.attributes?.prop_rationale}
							</Typography>
						</Box>

						<Box mt={4}>
							<Typography variant="caption">
								Supporting links
							</Typography>

							<Box>
								{proposal?.attributes?.proposal_links?.map(
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
											component={Link}
											href={`${item?.prop_link}`}
										>
											{item?.prop_link_text}
										</Button>
									)
								)}
							</Box>
						</Box>
						<Box
							mt={4}
							display={"flex"}
							flexDirection={"row"}
							justifyContent={"space-between"}
						>
							<IconButton>
								<Badge
									badgeContent={32}
									color={"primary"}
									aria-label="comments"
									showZero
									sx={{
										transform: "translate(30px, -20px)",
										"& .MuiBadge-badge": {
											color: "white",
											backgroundColor: (theme) =>
												theme.palette.badgeColors
													.primary,
										},
									}}
								></Badge>
								<IconChatAlt />
							</IconButton>
							<Box display={"flex"} gap={1}>
								<IconButton
									sx={{
										border: (theme) =>
											`1px solid ${theme.palette.iconButton.outlineLightColor}`,
									}}
								>
									<Badge
										badgeContent={1}
										color={"primary"}
										aria-label="comments"
										sx={{
											transform: "translate(30px, -20px)",
											"& .MuiBadge-badge": {
												color: "white",
												backgroundColor: (theme) =>
													theme.palette.badgeColors
														.secondary,
											},
										}}
									></Badge>
									<IconThumbUp />
								</IconButton>
								<IconButton
									sx={{
										border: (theme) =>
											`1px solid ${theme.palette.iconButton.outlineLightColor}`,
									}}
								>
									<Badge
										badgeContent={0}
										showZero
										aria-label="comments"
										sx={{
											transform: "translate(30px, -20px)",
											"& .MuiBadge-badge": {
												color: "white",
												backgroundColor: (theme) =>
													theme.palette.badgeColors
														.errorLight,
											},
										}}
									></Badge>
									<IconThumbDown />
								</IconButton>
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
