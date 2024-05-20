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
} from '@mui/material';

import { formatIsoDate } from '@/lib/utils';
import { Link } from '@/navigation';
import { useTheme } from '@emotion/react';

const ProposalCard = ({ proposal }) => {
	const theme = useTheme();

	return (
		<Card
			raised
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
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
						{proposal?.attributes?.content?.attributes?.prop_name}
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
				<Box display={'flex'} flexDirection={'column'} gap={2} mb={3}>
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
									?.gov_action_type?.gov_action_type_name
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
						justifyContent={'center'}
						alignItems={'center'}
						gap={1}
					>
						<IconInformationCircle
							color={theme.palette.primary.icons.black}
						/>
						<Typography
							variant="body2"
							component="p"
							color="text.black"
						>
							{`Proposed on: ${formatIsoDate(
								proposal?.attributes?.createdAt
							)}`}
						</Typography>
					</Box>
					<Box
						display={'flex'}
						flexDirection={'row'}
						justifyContent={'space-between'}
					>
						<Box display={'flex'} gap={1}>
							<IconButton>
								<Badge
									badgeContent={
										proposal?.attributes
											?.prop_comments_number || 0
									}
									aria-label="comments"
									showZero
									sx={{
										transform: 'translate(30px, -20px)',
										'& .MuiBadge-badge': {
											color: 'white',
											backgroundColor: (theme) =>
												theme.palette.badgeColors.error,
										},
									}}
								></Badge>
								<IconChatAlt />
							</IconButton>
							<IconButton aria-label="edit">
								<IconPencilAlt />
							</IconButton>
						</Box>
						<Button
							variant="contained"
							component={Link}
							href={`/proposed-governance-actions/${proposal?.id}`}
						>
							View Details
						</Button>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default ProposalCard;
