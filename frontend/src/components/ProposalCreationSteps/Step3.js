import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	Link,
} from '@mui/material';
import { IconPencil } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
import { IconLink } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Step3Modal } from '@/components/ProposalCreationSteps';
import { useState } from 'react';

const Step3 = ({
	setStep,
	proposalData,
	governanceActionTypes,
	isSmallScreen,
	handleSaveDraft,
}) => {
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Card
			variant="outlined"
			sx={{
				boxShadow: 1,
				borderRadius: '20px',
				mb: 2,
				maxWidth: '910px',
			}}
		>
			<CardContent
				sx={{
					pb: 2,
					pl: {
						xs: 2,
						md: 20,
					},
					pr: {
						xs: 2,
						md: 20,
					},
				}}
			>
				<Box display="flex" flexDirection="column" gap={2}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							mt: 2,
							mb: 4,
						}}
					>
						<Typography variant="h4" gutterBottom>
							Review Your Submission
						</Typography>

						<Typography variant="subtitle" gutterBottom>
							Subtext to describe something if needed
						</Typography>
					</Box>

					<Typography variant="h5" gutterBottom>
						{proposalData?.prop_name}
					</Typography>

					<Box>
						<Typography
							variant="body1"
							color={theme.palette.text.blueGrey}
							gutterBottom
						>
							Goverance Action Type
						</Typography>
						<Typography variant="body1" gutterBottom>
							{
								governanceActionTypes.find(
									(x) =>
										x.value ===
										proposalData?.gov_action_type_id
								).label
							}
						</Typography>
					</Box>

					<Box>
						<Typography
							variant="body1"
							color={theme.palette.text.blueGrey}
							gutterBottom
						>
							Abstrtact
						</Typography>
						<Typography variant="body1" gutterBottom>
							{proposalData?.prop_abstract}
						</Typography>
					</Box>

					<Box>
						<Typography
							variant="body1"
							color={theme.palette.text.blueGrey}
							gutterBottom
						>
							Motivation
						</Typography>
						<Typography variant="body1" gutterBottom>
							{proposalData?.prop_motivation}
						</Typography>
					</Box>

					<Box>
						<Typography
							variant="body1"
							color={theme.palette.text.blueGrey}
							gutterBottom
						>
							Rationale
						</Typography>
						<Typography variant="body1" gutterBottom>
							{proposalData?.prop_rationale}
						</Typography>
					</Box>

					<Box>
						<Typography
							variant="body1"
							color={theme.palette.text.blueGrey}
							gutterBottom
						>
							Supporting links
						</Typography>
						<Box display="flex" flexDirection="row" gap={2}>
							{proposalData?.proposal_links?.map(
								(link, index) => (
									<Box
										key={index}
										display="flex"
										flexDirection="row"
										alignItems="center"
										component={Link}
										href={link?.prop_link}
										target="_blank"
										rel="noopener noreferrer"
										sx={{ textDecoration: 'none' }}
									>
										<Box mr={0.5}>
											<IconLink
												fill={
													theme.palette.primary.main
												}
											/>
										</Box>
										<Typography
											variant="body1"
											component="span"
										>
											{link?.prop_text}
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
						flexDirection: isSmallScreen ? 'column' : 'row',
						justifyContent: 'space-between',
						mt: 10,
					}}
				>
					<Box>
						<Button
							variant="outlined"
							startIcon={
								<IconPencil fill={theme.palette.primary.main} />
							}
							sx={{
								borderRadius: '20px',
								mb: {
									xs: 2,
									md: 0,
								},
							}}
							fullWidth={isSmallScreen}
							onClick={() => setStep(2)}
						>
							Back to editing
						</Button>
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: 2,
						}}
					>
						<Button
							variant="text"
							sx={{
								borderRadius: '20px',
							}}
							onClick={() => {
								handleSaveDraft(false, true);
							}}
						>
							Save Draft
						</Button>
						<Button
							variant="contained"
							sx={{
								borderRadius: '20px',
							}}
							onClick={handleOpen}
						>
							Submit
						</Button>
					</Box>
				</Box>
				<Step3Modal
					open={open}
					handleClose={handleClose}
					handleSaveDraft={handleSaveDraft}
				/>
			</CardContent>
		</Card>
	);
};

export default Step3;
