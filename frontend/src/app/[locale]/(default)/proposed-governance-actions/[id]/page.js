'use client';

import { useEffect, useState } from 'react';
import { CommentCard } from '@/components';
import Poll from '@/components/Poll';
import { createComment, getComments, getSingleProposal } from '@/lib/api';
import { formatIsoDate } from '@/lib/utils';
import { Link } from '@/navigation';
import { useTheme } from '@emotion/react';
import {
	IconChatAlt,
	IconCheveronLeft,
	IconDotsVertical,
	IconLink,
	IconPencilAlt,
	IconSort,
	IconThumbDown,
	IconThumbUp,
	IconTrash,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
	Badge,
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useAppContext } from '@/context/context';

const ProposalPage = ({ params: { id } }) => {
	const { user } = useAppContext();
	const theme = useTheme();
	const [proposal, setProposal] = useState(null);
	const [mounted, setMounted] = useState(false);
	const [commentsList, setCommentsList] = useState([]);
	const [newCommentText, setNewCommentText] = useState('');

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const fetchProposal = async (id) => {
		try {
			const response = await getSingleProposal(id);
			if (!response) return;
			setProposal(response);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchComments = async () => {
		try {
			let query = `filters[$and][0][proposal_id]=${id}&filters[$and][1][comment_parent_id][$null]=true&sort[createdAt]=desc`;
			const { comments, pgCount, total } = await getComments(query);
			if (!comments) return;

			setCommentsList(comments);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreateComment = async () => {
		try {
			const newComment = await createComment({
				user_id: user?.user?.id.toString(),
				proposal_id: id,
				comment_text: newCommentText,
			});

			if (!newComment) return;
			setNewCommentText('');
			fetchProposal(id);
			fetchComments();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		} else {
			fetchProposal(id);
			fetchComments();
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
									{
										proposal?.attributes?.content
											?.attributes?.prop_name
									}
								</Typography>
							</Grid>

							<Grid
								item
								xs={1}
								display="flex"
								justifyContent="flex-end"
							>
								<IconButton
									id="menu-button"
									sx={{
										width: 40,
										height: 40,
									}}
									aria-controls={
										open ? 'proposal-menu' : undefined
									}
									aria-haspopup="true"
									aria-expanded={open ? 'true' : undefined}
									onClick={handleClick}
								>
									<IconDotsVertical width="24" height="24" />
								</IconButton>
								<Menu
									id="proposal-menu"
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										'aria-labelledby': 'menu-button',
									}}
									slotProps={{
										paper: {
											elevation: 4,
											sx: {
												overflow: 'visible',
												mt: 1,
											},
										},
									}}
									transformOrigin={{
										horizontal: 'right',
										vertical: 'top',
									}}
									anchorOrigin={{
										horizontal: 'right',
										vertical: 'bottom',
									}}
								>
									<MenuItem onClick={handleClose}>
										<Stack
											direction={'row'}
											spacing={2}
											alignItems={'center'}
										>
											<IconPencilAlt
												color={
													theme.palette.primary.icons
														.black
												}
												height={24}
												width={24}
											/>
											<Typography variant="body1">
												Edit Proposal
											</Typography>
										</Stack>
									</MenuItem>
									<MenuItem onClick={handleClose}>
										<Stack
											direction={'row'}
											spacing={2}
											alignItems={'center'}
										>
											<IconTrash
												color={
													theme.palette.primary.icons
														.black
												}
												height={24}
												width={24}
											/>
											<Typography variant="body1">
												Delete Proposal
											</Typography>
										</Stack>
									</MenuItem>
								</Menu>
							</Grid>
						</Grid>

						<Box mt={2}>
							<Typography variant="caption">
								Governance Action Type
							</Typography>
							<Typography variant="body2">
								{
									proposal?.attributes?.content?.attributes
										?.gov_action_type?.gov_action_type_name
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
									proposal?.attributes?.content?.attributes
										?.createdAt
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
								{
									proposal?.attributes?.content?.attributes
										?.prop_abstract
								}
							</Typography>
						</Box>
						<Box mt={4}>
							<Typography variant="caption">
								Motivation
							</Typography>
							<Typography variant="body2">
								{
									proposal?.attributes?.content?.attributes
										?.prop_motivation
								}
							</Typography>
						</Box>
						<Box mt={4}>
							<Typography variant="caption">Rationale</Typography>
							<Typography variant="body2">
								{
									proposal?.attributes?.content?.attributes
										?.prop_rationale
								}
							</Typography>
						</Box>

						<Box mt={4}>
							<Typography variant="caption">
								Supporting links
							</Typography>

							<Box>
								{proposal?.attributes?.content?.attributes?.proposal_links?.map(
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
							display={'flex'}
							flexDirection={'row'}
							justifyContent={'space-between'}
						>
							<IconButton>
								<Badge
									badgeContent={
										proposal?.attributes
											?.prop_comments_number || 0
									}
									aria-label="proposal comments"
									showZero
									sx={{
										transform: 'translate(30px, -20px)',
										'& .MuiBadge-badge': {
											color: 'white',
											backgroundColor: (theme) =>
												theme.palette.badgeColors
													.primary,
										},
									}}
								></Badge>
								<IconChatAlt />
							</IconButton>
							<Box display={'flex'} gap={1}>
								<IconButton
									sx={{
										border: (theme) =>
											`1px solid ${theme.palette.iconButton.outlineLightColor}`,
									}}
								>
									<Badge
										badgeContent={
											proposal?.attributes?.prop_likes ||
											0
										}
										showZero
										aria-label="proposal likes"
										sx={{
											transform: 'translate(30px, -20px)',
											'& .MuiBadge-badge': {
												color: 'white',
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
										badgeContent={
											proposal?.attributes
												?.prop_dislikes || 0
										}
										showZero
										aria-label="proposal dislikes"
										sx={{
											transform: 'translate(30px, -20px)',
											'& .MuiBadge-badge': {
												color: 'white',
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
				<Poll
					proposalID={id}
					proposalUserId={proposal?.attributes?.user_id}
				/>
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
							value={newCommentText || ''}
							onChange={(e) => setNewCommentText(e.target.value)}
						/>

						<Box
							mt={2}
							display="flex"
							justifyContent={user ? 'flex-end' : 'space-between'}
						>
							{!user && (
								<Typography variant="body2">
									Connect wallet to submit a comment or create
									proposal
								</Typography>
							)}

							<Button
								variant="contained"
								onClick={handleCreateComment}
								disabled={!newCommentText || !user}
							>
								Comment
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Box>

			{commentsList?.map((comment, index) => (
				<Box mt={4} key={index}>
					<CommentCard comment={comment} />
				</Box>
			))}
		</Box>
	);
};

export default ProposalPage;
