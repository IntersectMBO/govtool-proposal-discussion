'use client';

import { CommentCard } from '@/components';
import Poll from '@/components/Poll';
import { useAppContext } from '@/context/context';
import
	{
		createComment,
		createProposalLikeOrDislike,
		deleteProposal,
		getComments,
		getSingleProposal,
		getUserProposalVote,
		updateProposalLikesOrDislikes,
	} from '@/lib/api';
import { formatIsoDate } from '@/lib/utils';
import { Link, useRouter } from '@/navigation';
import { useTheme } from '@emotion/react';
import
	{
		IconChatAlt,
		IconCheveronLeft,
		IconDotsVertical,
		IconInformationCircle,
		IconLink,
		IconPencilAlt,
		IconReply,
		IconSort,
		IconThumbDown,
		IconThumbUp,
		IconTrash,
		IconX,
	} from '@intersect.mbo/intersectmbo.org-icons-set';
import
	{
		Badge,
		Box,
		Button,
		Card,
		CardContent,
		CardHeader,
		Grid,
		IconButton,
		Menu,
		MenuItem,
		Modal,
		Stack,
		TextField,
		Typography,
		alpha,
	} from '@mui/material';
import { useEffect, useState } from 'react';

const ProposalPage = ({ params: { id } }) => {
	const { user, setLoading } = useAppContext();
	const theme = useTheme();
	const router = useRouter();
	const [proposal, setProposal] = useState(null);
	const [mounted, setMounted] = useState(false);
	const [commentsList, setCommentsList] = useState([]);
	const [newCommentText, setNewCommentText] = useState('');
	const [userProposalVote, setUserProposalVote] = useState(null);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleOpenDeleteModal = () => {
		setOpenDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setOpenDeleteModal(false);
	};

	const handleDeleteProposal = async () => {
		setLoading(true);
		try {
			const response = await deleteProposal(proposal?.id);
			if (!response) return;

			handleCloseDeleteModal();
			router.push('/proposed-governance-actions');
		} catch (error) {
			console.error('Failed to delete proposal:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchProposal = async (id) => {
		setLoading(true);
		try {
			const response = await getSingleProposal(id);
			if (!response) return;
			setProposal(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchProposalVote = async (id) => {
		setLoading(true);
		try {
			const response = await getUserProposalVote({ proposalID: id });
			setUserProposalVote(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchComments = async () => {
		setLoading(true);
		try {
			let query = `filters[$and][0][proposal_id]=${id}&filters[$and][1][comment_parent_id][$null]=true&sort[createdAt]=desc`;
			const { comments, pgCount, total } = await getComments(query);
			if (!comments) return;

			setCommentsList(comments);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateComment = async () => {
		setLoading(true);
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
		} finally {
			setLoading(false);
		}
	};

	const updateLikesOrDislikes = async ({ like = true }) => {
		setLoading(true);
		try {
			let data = userProposalVote
				? {
						vote_result: !userProposalVote?.attributes?.vote_result,
				  }
				: {
						proposal_id: id,
						vote_result: like,
				  };

			const response = userProposalVote
				? await updateProposalLikesOrDislikes({
						proposalVoteID: userProposalVote?.id,
						updateData: data,
				  })
				: await createProposalLikeOrDislike({ createData: data });

			if (!response) return;

			setUserProposalVote(response);
			fetchProposal(id);
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
			fetchProposal(id);
			fetchComments();
			if (user) fetchProposalVote(id);
		}
	}, [id, mounted, user]);
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
				<Card
					variant="outlined"
					sx={{
						backgroundColor: alpha('#FFFFFF', 0.3),
					}}
				>
					<CardHeader
						sx={{
							pt: 1,
							pb: 1,
							backgroundColor: alpha('#F2F4F8', 0.7),
						}}
						title={
							<>
								<Box
									display={'flex'}
									justifyContent={'center'}
									alignItems={'center'}
									flexDirection={'row'}
								>
									<Typography variant="caption" component="p">
										{`Proposed on: ${formatIsoDate(
											proposal?.attributes?.createdAt
										)}`}
									</Typography>
									<IconInformationCircle
										width={16}
										height={16}
										fill={
											theme?.palette?.primary?.icons?.grey
										}
									/>
								</Box>
							</>
						}
					></CardHeader>
					{user?.user?.id?.toString() ===
						proposal?.attributes?.user_id?.toString() && (
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
										proposalContent as a governance action
										to get voted on
									</Typography>
								</Box>

								<Box>
									<Button variant="outlined">
										Submit as Governance Action
									</Button>
								</Box>
							</Box>
						</CardContent>
					)}
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

							{user?.user?.id?.toString() ===
								proposal?.attributes?.user_id?.toString() && (
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
										aria-expanded={
											open ? 'true' : undefined
										}
										onClick={handleClick}
									>
										<IconDotsVertical
											width="24"
											height="24"
										/>
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
														theme.palette.primary
															.icons.black
													}
													height={24}
													width={24}
												/>
												<Typography variant="body1">
													Edit Proposal
												</Typography>
											</Stack>
										</MenuItem>
										<MenuItem
											onClick={handleOpenDeleteModal}
										>
											<Stack
												direction={'row'}
												spacing={2}
												alignItems={'center'}
											>
												<IconTrash
													color={
														theme.palette.primary
															.icons.black
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
							)}
						</Grid>

						<Box mt={2}>
							<Typography variant="caption">
								Governance Action Type
							</Typography>
							<Typography variant="body2">
								{
									proposal?.attributes?.content?.attributes
										?.gov_action_type?.attributes
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
									proposal?.attributes?.content?.attributes
										?.createdAt
								)}`}
							</Typography>
							{user?.user?.id?.toString() ===
								proposal?.attributes?.user_id?.toString() && (
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
							)}
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
								{/* LIKE BUTTON */}
								<IconButton
									sx={{
										border: (theme) =>
											`1px solid ${theme.palette.iconButton.outlineLightColor}`,
									}}
									disabled={
										user
											? userProposalVote
												? userProposalVote?.attributes
														?.vote_result === true
													? true
													: false
												: false
											: true
									}
									onClick={() =>
										user &&
										userProposalVote?.attributes
											?.vote_result === true
											? null
											: updateLikesOrDislikes({
													like: true,
											  })
									}
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
									<IconThumbUp
										fill={
											user
												? userProposalVote
													? userProposalVote
															?.attributes
															?.vote_result ===
													  true
														? theme?.palette
																?.primary?.main
														: theme?.palette
																?.primary?.icons
																?.black
													: theme?.palette?.primary
															?.icons?.black
												: theme?.palette?.primary?.icons
														?.black
										}
									/>
								</IconButton>
								{/* DISLIKE BUTTON */}
								<IconButton
									sx={{
										border: (theme) =>
											`1px solid ${theme.palette.iconButton.outlineLightColor}`,
									}}
									disabled={
										user
											? userProposalVote
												? userProposalVote?.attributes
														?.vote_result === false
													? true
													: false
												: false
											: true
									}
									onClick={() =>
										userProposalVote?.attributes
											?.vote_result === false
											? null
											: updateLikesOrDislikes({
													like: false,
											  })
									}
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
									<IconThumbDown
										fill={
											user
												? userProposalVote
													? userProposalVote
															?.attributes
															?.vote_result ===
													  false
														? theme?.palette
																?.primary?.main
														: theme?.palette
																?.primary?.icons
																?.black
													: theme?.palette?.primary
															?.icons?.black
												: theme?.palette?.primary?.icons
														?.black
										}
									/>
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
								endIcon={
									<IconReply
										height={18}
										width={18}
										fill={
											!newCommentText || !user
												? 'rgba(0,0,0, 0.26)'
												: 'white'
										}
									/>
								}
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

			<Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
				<Box
					sx={{
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
					}}
				>
					<Box
						pt={2}
						pl={2}
						pr={2}
						pb={1}
						borderBottom={1}
						borderColor={(theme) => theme.palette.border.lightGray}
					>
						<Box
							display="flex"
							flexDirection="row"
							justifyContent="space-between"
							alignItems={'center'}
						>
							<Typography
								id="modal-modal-title"
								variant="h6"
								component="h2"
							>
								Do you want to delete your proposal?
							</Typography>
							<IconButton onClick={handleCloseDeleteModal}>
								<IconX width="24px" height="24px" />
							</IconButton>
						</Box>
						<Typography
							id="modal-modal-description"
							mt={2}
							color={(theme) => theme.palette.text.grey}
						>
							A dialog is a type of modal window that appears in
							front of app content to provide critical
							information, or prompt for a decision to be made.
						</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection="column"
						padding={2}
						gap={2}
					>
						<Button
							variant="contained"
							fullWidth
							sx={{
								borderRadius: '20px',
							}}
							onClick={handleCloseDeleteModal}
						>
							I don't want to delete
						</Button>
						<Button
							variant="outlined"
							fullWidth
							sx={{
								borderRadius: '20px',
							}}
							onClick={handleDeleteProposal}
						>
							Yes, delete my proposal completely
						</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};

export default ProposalPage;
