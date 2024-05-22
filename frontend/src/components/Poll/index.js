import { useAppContext } from '@/context/context';
import {
	createPoll,
	createPollVote,
	getPoll,
	getUserPollVote,
} from '@/lib/api';
import { formatPollDateDisplay } from '@/lib/utils';
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	LinearProgress,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

const Poll = ({ proposalID, proposalUserId }) => {
	const { user } = useAppContext();
	const [poll, setPoll] = useState(null);
	const [userPollVote, setUserPollVote] = useState(null);
	const [mounted, setMounted] = useState(false);

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
				{user && !userPollVote ? (
					<Card sx={{ mb: 3 }}>
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
					</CardContent>
				</Card>
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
