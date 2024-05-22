import { useAppContext } from '@/context/context';
import {
	createPoll,
	createPollVote,
	getPoll,
	getUserPollVote,
	updatePollVote,
} from '@/lib/api';
import { formatPollDateDisplay } from '@/lib/utils';
import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	IconButton,
	LinearProgress,
	Modal,
	Typography,
	alpha,
} from '@mui/material';
import { useEffect, useState } from 'react';

const Poll = ({ proposalID, proposalUserId }) => {
	const { user, setLoading } = useAppContext();
	const [poll, setPoll] = useState(null);
	const [userPollVote, setUserPollVote] = useState(null);
	const [mounted, setMounted] = useState(false);
	const [showChangeVoteModal, setShowChangeVoteModal] = useState(false);

	const fetchPoll = async (id) => {
		try {
			const response = await getPoll({ proposalID: id });
			if (!response) return;
			setPoll(response);
		} catch (error) {
			console.error(error);
		}
	};
	const fetchUserPollVote = async (id) => {
		try {
			const response = await getUserPollVote({ pollID: id });
			if (!response) return;
			setUserPollVote(response);
		} catch (error) {
			console.error(error);
		}
	};

	const addPoll = async () => {
		try {
			const response = await createPoll({
				pollData: {
					data: {
						proposal_id: proposalID,
						poll_start_dt: new Date(),
						is_poll_active: true,
					},
				},
			});
			if (!response) return;
			setPoll(response);
		} catch (error) {
			console.error(error);
		}
	};

	const totalVotesGreaterThanZero = (pollData) => {
		const yes = +pollData?.attributes?.poll_yes;
		const no = +pollData?.attributes?.poll_no;

		if (yes + no > 0) {
			return true;
		} else {
			return false;
		}
	};

	const calculatePercentage = (pollData, yes = true) => {
		return Math.round(
			(+pollData?.attributes?.[yes ? 'poll_yes' : 'poll_no'] /
				(+pollData?.attributes?.poll_yes +
					+pollData?.attributes?.poll_no)) *
				100
		);
	};

	const handlePollVote = async ({ vote }) => {
		try {
			const response =
				// userProposalVote
				// ? await updateProposalLikesOrDislikes({
				// 		proposalVoteID: userProposalVote?.id,
				// 		updateData: data,
				//   })
				// :
				await createPollVote({
					createData: { poll_id: `${poll?.id}`, vote_result: vote },
				});

			if (!response) return;

			setUserPollVote(response);
			fetchPoll(proposalID);
		} catch (error) {
			console.error(error);
		}
	};

	const toggleChangeVoteModal = () => {
		setShowChangeVoteModal((prev) => !prev);
	};

	const handlePollVoteChange = async () => {
		setLoading(true);
		try {
			const response = await updatePollVote({
				pollVoteID: userPollVote?.id,
				updateData: {
					vote_result: !userPollVote?.attributes?.vote_result,
				},
			});

			if (!response) return;
			setUserPollVote(response);
			fetchPoll(proposalID);
			toggleChangeVoteModal();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			if (poll) {
				if (!userPollVote) {
					fetchUserPollVote(poll?.id);
				}
			}
		}
	}, [user, poll]);

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		} else {
			fetchPoll(proposalID);
		}
	}, [proposalID, mounted]);

	if (poll) {
		return (
			<>
				{user && !userPollVote && user?.user?.id !== +proposalUserId ? (
					<Card
						sx={{
							mb: 3,
							backgroundColor: alpha('#FFFFFF', 0.3),
						}}
					>
						<CardContent
							sx={{ display: 'flex', flexDirection: 'column' }}
						>
							<Typography variant="body2">
								@Authorusername
							</Typography>
							<Typography
								variant="caption"
								sx={{
									color: (theme) => theme.palette.text.grey,
								}}
								mt={2}
							>
								{formatPollDateDisplay(
									poll?.attributes?.poll_start_dt
								)}
							</Typography>
							<Typography variant="body1" fontWeight={600} my={2}>
								Is this proposal ready to be submitted on chain?
							</Typography>

							<Button
								variant="outlined"
								sx={{ mb: 1 }}
								onClick={() => handlePollVote({ vote: true })}
							>
								Yes
							</Button>
							<Button
								variant="outlined"
								onClick={() => handlePollVote({ vote: false })}
							>
								No
							</Button>
						</CardContent>
					</Card>
				) : null}
				<Card>
					<CardContent
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						<Typography variant="body2">@Authorusername</Typography>
						<Typography
							variant="caption"
							sx={{
								color: (theme) => theme.palette.text.grey,
							}}
							mt={2}
						>
							{formatPollDateDisplay(
								poll?.attributes?.poll_start_dt
							)}
						</Typography>
						<Typography variant="body1" fontWeight={600} mt={2}>
							Poll Results
						</Typography>
						<Typography variant="body2" mt={1}>
							Is this proposal ready to be submitted on chain?
						</Typography>
						<Divider
							variant="fullWidth"
							sx={{
								my: 2,
								color: (theme) => theme.palette.divider.primary,
							}}
						/>
						<Typography
							variant="caption"
							sx={{
								color: (theme) => theme.palette.text.black,
							}}
						>
							Total votes:{' '}
							{+poll?.attributes?.poll_yes +
								+poll?.attributes?.poll_no}
						</Typography>
						<Box
							display={'flex'}
							width={'100%'}
							justifyContent={'flex-start'}
							alignItems={'center'}
							mt={1}
							gap={1}
						>
							<Typography
								variant="caption"
								sx={{
									color: (theme) => theme.palette.text.black,
									textWrap: 'nowrap',
									minWidth: '80px',
								}}
								fontWeight={
									userPollVote?.attributes?.vote_result ===
										true && 600
								}
							>
								{`Yes: (${
									totalVotesGreaterThanZero(poll)
										? calculatePercentage(poll, true)
										: 0
								}%)`}
							</Typography>
							{user?.user?.id !== +proposalUserId && (
								<LinearProgress
									variant="determinate"
									color="primary"
									value={
										totalVotesGreaterThanZero(poll)
											? calculatePercentage(poll, true)
											: 0
									}
									sx={{
										height: '6px',
										width: '100%',
										borderRadius: 100,
									}}
								/>
							)}
						</Box>
						<Box
							display={'flex'}
							width={'100%'}
							justifyContent={'flex-start'}
							alignItems={'center'}
							mt={1}
							gap={1}
						>
							<Typography
								variant="caption"
								sx={{
									color: (theme) => theme.palette.text.black,
									textWrap: 'nowrap',
									minWidth: '80px',
								}}
								fontWeight={
									userPollVote?.attributes?.vote_result ===
										false && 600
								}
							>
								{`No: (${
									totalVotesGreaterThanZero(poll)
										? calculatePercentage(poll, false)
										: 0
								}%)`}
							</Typography>
							{user?.user?.id !== +proposalUserId && (
								<LinearProgress
									variant="determinate"
									color="primary"
									value={
										totalVotesGreaterThanZero(poll)
											? calculatePercentage(poll, false)
											: 0
									}
									sx={{
										height: '6px',
										width: '100%',
										borderRadius: 100,
									}}
								/>
							)}
						</Box>
						{user?.user?.id === +proposalUserId &&
							poll?.attributes?.is_poll_active && (
								<Box
									mt={2}
									display={'flex'}
									justifyContent={'flex-end'}
								>
									<Button variant="outlined">
										Close Poll
									</Button>
								</Box>
							)}
						{user &&
							userPollVote &&
							user?.user?.id !== +proposalUserId &&
							poll?.attributes?.is_poll_active && (
								<Box
									mt={2}
									display={'flex'}
									justifyContent={'flex-end'}
								>
									<Button
										variant="outlined"
										onClick={toggleChangeVoteModal}
									>
										Change Vote
									</Button>
								</Box>
							)}
					</CardContent>
				</Card>
				<Modal
					open={showChangeVoteModal}
					onClose={toggleChangeVoteModal}
				>
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
							borderColor={(theme) =>
								theme.palette.border.lightGray
							}
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
									Do you really want to change your Poll Vote?
								</Typography>
								<IconButton onClick={toggleChangeVoteModal}>
									<IconX width="24px" height="24px" />
								</IconButton>
							</Box>
							<Typography
								id="modal-modal-description"
								mt={2}
								color={(theme) => theme.palette.text.grey}
							>
								{`Currently your Poll Vote is ${
									userPollVote?.attributes?.vote_result
										? 'Yes'
										: 'No'
								}. After changing your vote, it will be ${
									userPollVote?.attributes?.vote_result
										? 'No'
										: 'Yes'
								}.`}
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
								onClick={toggleChangeVoteModal}
							>
								I don't want to change
							</Button>
							<Button
								variant="outlined"
								fullWidth
								sx={{
									borderRadius: '20px',
								}}
								onClick={handlePollVoteChange}
							>
								Yes, change my Poll Vote
							</Button>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}

	return user && user?.user?.id === +proposalUserId ? (
		<Card>
			<CardContent>
				<Typography variant="body1" fontWeight={600}>
					Do you want to check if your proposal is ready to be
					submitted as a Governance Action?
				</Typography>

				<Typography variant="body2" mt={2}>
					Poll will be pinned to top of your comments list. You can
					close poll any time you like. Every next poll will close
					previous one. Previous polls will be displayed as a comment
					in the comments feed.
				</Typography>

				<Box mt={2} display="flex" justifyContent="flex-end">
					<Button variant="contained" onClick={addPoll}>
						Add Poll
					</Button>
				</Box>
			</CardContent>
		</Card>
	) : null;
};

export default Poll;
