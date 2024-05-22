'use client';

import {
	IconChatAlt,
	IconInformationCircle,
	IconPencilAlt,
	IconShare,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
	Badge,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Typography,
	alpha,
	styled,
} from '@mui/material';

import { formatIsoDate } from '@/lib/utils';
import { Link } from '@/navigation';
import { useTheme } from '@emotion/react';

const ProposalCard = ({ proposal }) => {
	const theme = useTheme();

	const CardStatusBadge = styled(Badge)(({ theme }) => ({
		width: '100%',
		height: '100%',
		'& .MuiBadge-badge': {
			transform: 'translate(-25px, -15px)',
			color: theme.palette.text.black,
			backgroundColor: theme.palette.badgeColors.lightPurple,
			padding: '14px 12px',
			borderRadius: 100,
		},
	}));

	const StyledBadge = styled(Badge)(({ theme }) => ({
		'& .MuiBadge-badge': {
			transform: 'translate(40px, -30px) !important',
			color: 'white !important',
			backgroundColor: `${theme.palette.badgeColors.error} !important`,
			padding: 'unset !important',
			borderRadius: 'none !important',
		},
	}));

	const CardContentComponent = ({ proposal }) => {
		return (
			<Card
				raised
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					height: '100%',
					backgroundColor: alpha('#FFFFFF', 0.3),
					minHeight: '400px',
				}}
			>
				<CardHeader
					action={
						<IconButton aria-label="settings">
							<IconShare />
						</IconButton>
					}
					title={
						<Typography
							variant="h6"
							component="h3"
							sx={{
								display: '-webkit-box',
								WebkitBoxOrient: 'vertical',
								WebkitLineClamp: 2,
								lineClamp: 2,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{
								proposal?.attributes?.content?.attributes
									?.prop_name
							}
						</Typography>
					}
				/>
				<CardContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
					}}
				>
					<Box
						display={'flex'}
						flexDirection={'column'}
						gap={2}
						mb={3}
					>
						<Box>
							<Typography
								variant="caption"
								component="p"
								color="text.grey"
							>
								Abstract
							</Typography>
							<Typography
								variant="body2"
								component="p"
								color="text.darkPurple"
								sx={{
									display: '-webkit-box',
									WebkitBoxOrient: 'vertical',
									WebkitLineClamp: 3,
									lineClamp: 3,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
							>
								{
									proposal?.attributes?.content?.attributes
										?.prop_abstract
								}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant="caption"
								component="p"
								color="text.grey"
							>
								Governance Action Type
							</Typography>
							<Typography
								variant="body2"
								component="p"
								color="text.darkPurple"
							>
								{
									proposal?.attributes?.content?.attributes
										?.gov_action_type?.attributes
										?.gov_action_type_name
								}
							</Typography>
						</Box>
					</Box>
					<Box
						display={'flex'}
						flexDirection={'column'}
						mt={'auto'}
						gap={3}
						pt={3}
					>
						<Box
							display={'flex'}
							flexDirection={'row'}
							alignItems={'center'}
							gap={1}
							py={1}
							px={1}
							sx={{
								backgroundColor: (theme) =>
									theme.palette.divider.primary,
								borderRadius: '14px',
							}}
						>
							<IconInformationCircle
								color={theme.palette.primary.icons.black}
							/>
							<Typography
								variant="body2"
								component="p"
								color="text.black"
							>
								{proposal?.attributes?.content?.attributes
									?.prop_rev_active
									? `Proposed on: ${formatIsoDate(
											proposal?.attributes?.createdAt
									  )}`
									: 'Not submitted'}
							</Typography>
						</Box>
						<Box
							display={'flex'}
							flexDirection={'row'}
							justifyContent={'space-between'}
						>
							{proposal?.attributes?.content?.attributes
								?.prop_rev_active ? (
								<Box display={'flex'} gap={1}>
									<IconButton>
										<StyledBadge
											badgeContent={
												proposal?.attributes
													?.prop_comments_number || 0
											}
											aria-label="comments"
											showZero
										></StyledBadge>
										<IconChatAlt />
									</IconButton>
									<IconButton aria-label="edit">
										<IconPencilAlt />
									</IconButton>
								</Box>
							) : null}
							<Button
								variant="contained"
								component={Link}
								href={`/proposed-governance-actions/${proposal?.id}`}
								fullWidth={
									!proposal?.attributes?.content?.attributes
										?.prop_rev_active
								}
							>
								{proposal?.attributes?.content?.attributes
									?.prop_rev_active
									? 'View Details'
									: 'Start Editing'}
							</Button>
						</Box>
					</Box>
				</CardContent>
			</Card>
		);
	};

	return proposal?.attributes?.content?.attributes?.prop_rev_active ? (
		<CardContentComponent proposal={proposal} />
	) : (
		<CardStatusBadge
			badgeContent={'Draft'}
			aria-label="draft-badge"
			showZero
		>
			<CardContentComponent proposal={proposal} />
		</CardStatusBadge>
	);
};

export default ProposalCard;
