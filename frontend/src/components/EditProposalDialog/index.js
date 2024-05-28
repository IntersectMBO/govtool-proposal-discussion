'use client';

import {
	Dialog,
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
	Grid,
	MenuItem,
	Modal,
	IconButton,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import {
	IconCheveronLeft,
	IconTrash,
	IconInformationCircle,
	IconX,
	IconPencil,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { formatIsoDate } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { LinkManager } from '@/components/ProposalCreationSteps';
import { deleteProposal, createProposalContent } from '@/lib/api';
import { useAppContext } from '@/context/context';
import { useRouter } from '@/navigation';

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

const EditProposalDialog = ({
	proposal,
	openEditDialog,
	handleCloseEditDialog,
	handleClose,
	governanceActionTypes,
	setMounted,
	maxLength = 256,
}) => {
	const { user, setLoading } = useAppContext();
	const theme = useTheme();
	const router = useRouter();
	const [flatProposal, setFlatProposal] = useState({});
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);
	const [openSaveDraftModal, setOpenSaveDraftModal] = useState(false);
	const [openPublishftModal, setOpenPublishModal] = useState(false);

	const isSmallScreen = useMediaQuery((theme) =>
		theme.breakpoints.down('sm')
	);

	const handleIsSaveDisabled = () => {
		if (
			flatProposal?.gov_action_type_id &&
			flatProposal?.prop_name &&
			flatProposal?.prop_abstract &&
			flatProposal?.prop_motivation &&
			flatProposal?.prop_rationale &&
			flatProposal?.prop_receiving_address &&
			flatProposal?.prop_amount
		) {
			setIsSaveDisabled(false);
		} else {
			setIsSaveDisabled(true);
		}
	};

	const flattenProposalData = (proposalData) => {
		const flatProposal = {
			proposal_id: proposalData?.id,
			gov_action_type_id:
				proposalData?.attributes?.publishedContent?.attributes
					?.gov_action_type_id,
			prop_abstract:
				proposalData?.attributes?.publishedContent?.attributes
					?.prop_abstract,
			prop_amount:
				proposalData?.attributes?.publishedContent?.attributes
					?.prop_amount,
			prop_motivation:
				proposalData?.attributes?.publishedContent?.attributes
					?.prop_motivation,
			prop_name:
				proposalData?.attributes?.publishedContent?.attributes
					?.prop_name,
			prop_rationale:
				proposalData?.attributes?.publishedContent?.attributes
					?.prop_rationale,
			prop_receiving_address:
				proposalData?.attributes?.publishedContent?.attributes
					?.prop_receiving_address,
			proposal_links:
				proposalData?.attributes?.publishedContent?.attributes
					?.proposal_links,
		};

		return flatProposal;
	};

	const handleDeleteProposal = async () => {
		setLoading(true);
		try {
			const response = await deleteProposal(proposal?.id);
			if (!response) return;

			router.push('/proposed-governance-actions');
		} catch (error) {
			console.error('Failed to delete proposal:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveDraft = async (publish = false) => {
		setLoading(true);
		try {
			const response = await createProposalContent(flatProposal, publish);
			if (!response) return;
		} catch (error) {
			console.error('Failed to delete proposal:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenSaveDraftModal = () => {
		setOpenSaveDraftModal(true);
	};

	const handleCloseSaveDraftModal = () => {
		setOpenSaveDraftModal(false);
	};

	const handleOpenPublishModal = () => {
		setOpenPublishModal(true);
	};

	const handleClosePublishModal = () => {
		setOpenPublishModal(false);
	};

	useEffect(() => {
		setFlatProposal(flattenProposalData(proposal));
	}, [proposal]);

	useEffect(() => {
		handleIsSaveDisabled();
	}, [flatProposal]);

	useEffect(() => {
		setFlatProposal((prev) => ({
			...prev,
			user_id: user?.user?.id,
		}));
	}, [user]);

	return (
		<Box>
			<Dialog
				fullScreen
				open={openEditDialog}
				onClose={handleCloseEditDialog}
			>
				<Grid
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						backgroundImage: `url('/svg/ellipse-1.svg'), url('/svg/ellipse-2.svg')`,
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
						<Typography variant="h4" component="h1" gutterBottom>
							Edit Proposal
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
							onClick={() => {
								handleCloseEditDialog();
								handleClose();
							}}
						>
							Back
						</Button>
					</Grid>
					<Grid
						xs={12}
						item
						display="flex"
						justifyContent="center"
						alignContent="center"
					>
						<Grid xs={11} md={5} item zIndex={1} maxWidth="940px">
							<Card
								variant="outlined"
								sx={{
									boxShadow: 1,
									borderRadius: '20px',
									mb: 2,
									ml: 2,
									mr: 2,
									maxWidth: '910px',
								}}
							>
								<CardContent>
									<Box
										display="flex"
										flexDirection="column"
										gap={2}
									>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'center',
												mt: 2,
											}}
										>
											<Typography
												variant="subtitle2"
												color={(theme) =>
													theme.palette.text.orange
												}
												gutterBottom
											>
												REQUIRED
											</Typography>

											<Typography
												variant="h4"
												gutterBottom
											>
												Proposal Details
											</Typography>

											<Typography
												variant="subtitle"
												gutterBottom
											>
												Subtext to describe something if
												needed
											</Typography>
											<Button
												variant="outlined"
												sx={{
													borderRadius: '20px',
													mt: 2,
													mb: 2,
													color: 'black',
													borderColor: (theme) =>
														theme.palette.primary
															.lightGray,
													'&:hover': {
														backgroundColor:
															'rgba(0, 0, 0, 0.08)',
														borderColor: 'black',
														color: 'black',
													},
												}}
												startIcon={
													<IconTrash
														width="18"
														height="18"
													/>
												}
												onClick={handleDeleteProposal}
											>
												Delete Proposal
											</Button>
										</Box>

										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												textAlign: 'center',
												mb: 2,
											}}
										>
											<Box>
												<Typography
													variant="body2"
													component="p"
													sx={{
														display: 'flex',
														justifyContent:
															'center',
														alignItems: 'center',
														borderTopLeftRadius:
															'16px',
														borderTopRightRadius:
															'16px',
														borderBottomLeftRadius: 0,
														borderBottomRightRadius: 0,
														gap: 1,
														backgroundColor:
															'#B8CDFF',
														color: 'text.black',
													}}
												>
													<IconInformationCircle />
													{`Submit: ${formatIsoDate(
														proposal?.attributes
															?.createdAt
													)}`}
												</Typography>
											</Box>
											<Box>
												<Typography
													variant="body2"
													component="p"
													sx={{
														display: 'flex',
														justifyContent:
															'center',
														alignItems: 'center',
														borderTopLeftRadius: 0,
														borderTopRightRadius: 0,
														borderBottomLeftRadius:
															'16px',
														borderBottomRightRadius:
															'16px',
														gap: 1,
														backgroundColor:
															'#F3F4F8',
														color: 'text.black',
													}}
												>
													<IconInformationCircle />
													{`Last Edit: ${
														proposal?.attributes
															?.updatedAt
															? formatIsoDate(
																	proposal
																		?.attributes
																		?.updatedAt
															  )
															: '--'
													}`}
												</Typography>
											</Box>
										</Box>

										<TextField
											select
											label="Governance Action Type"
											fullWidth
											required
											value={
												flatProposal?.gov_action_type_id ||
												''
											}
											onChange={(e) => {
												setFlatProposal((prev) => ({
													...prev,
													gov_action_type_id:
														e.target.value,
												}));
											}}
										>
											{governanceActionTypes?.map(
												(option) => (
													<MenuItem
														key={option?.value}
														value={option?.value}
													>
														{option?.label}
													</MenuItem>
												)
											)}
										</TextField>

										<TextField
											fullWidth
											label="Title"
											variant="outlined"
											value={
												flatProposal?.prop_name || ''
											}
											onChange={(e) =>
												setFlatProposal((prev) => ({
													...prev,
													prop_name: e.target.value,
												}))
											}
											required
										/>

										<TextField
											size="large"
											name="Abstract"
											label="Abstract"
											placeholder="Summary..."
											multiline
											rows={4}
											value={
												flatProposal?.prop_abstract ||
												''
											}
											onChange={(e) =>
												setFlatProposal((prev) => ({
													...prev,
													prop_abstract:
														e.target.value,
												}))
											}
											required
											helperText={
												<>
													<Typography variant="caption">
														* General Summary of
														your proposal
													</Typography>
													<Typography
														variant="caption"
														sx={{ float: 'right' }}
													>
														{`${
															flatProposal
																?.prop_abstract
																?.length || 0
														}/${maxLength}`}
													</Typography>
												</>
											}
											InputProps={{
												inputProps: {
													maxLength: maxLength,
												},
											}}
										/>

										<TextField
											size="large"
											name="Motivation"
											label="Motivation"
											placeholder="Problem this will solve"
											multiline
											rows={4}
											value={
												flatProposal?.prop_motivation ||
												''
											}
											onChange={(e) =>
												setFlatProposal((prev) => ({
													...prev,
													prop_motivation:
														e.target.value,
												}))
											}
											required
											helperText={
												<>
													<Typography variant="caption">
														* How will this solve a
														problem
													</Typography>
													<Typography
														variant="caption"
														sx={{ float: 'right' }}
													>
														{`${
															flatProposal
																?.prop_motivation
																?.length || 0
														}/${maxLength}`}
													</Typography>
												</>
											}
											InputProps={{
												inputProps: {
													maxLength: maxLength,
												},
											}}
										/>

										<TextField
											size="large"
											name="Rationale"
											label="Rationale"
											placeholder="Problem this will solve"
											multiline
											rows={4}
											value={
												flatProposal?.prop_rationale ||
												''
											}
											onChange={(e) =>
												setFlatProposal((prev) => ({
													...prev,
													prop_rationale:
														e.target.value,
												}))
											}
											required
											helperText={
												<>
													<Typography variant="caption">
														* Put all the content of
														the Proposal here
													</Typography>
													<Typography
														variant="caption"
														sx={{ float: 'right' }}
													>
														{`${
															flatProposal
																?.prop_rationale
																?.length || 0
														}/${maxLength}`}
													</Typography>
												</>
											}
											InputProps={{
												inputProps: {
													maxLength: maxLength,
												},
											}}
										/>

										<TextField
											fullWidth
											margin="normal"
											label="Receiving address"
											variant="outlined"
											value={
												flatProposal?.prop_receiving_address ||
												''
											}
											onChange={(e) =>
												setFlatProposal((prev) => ({
													...prev,
													prop_receiving_address:
														e.target.value,
												}))
											}
											required
										/>

										<TextField
											fullWidth
											margin="normal"
											label="Amount"
											type="number"
											variant="outlined"
											placeholder="e.g. 2000"
											value={
												flatProposal?.prop_amount || ''
											}
											onChange={(e) =>
												setFlatProposal((prev) => ({
													...prev,
													prop_amount: e.target.value,
												}))
											}
											required
										/>

										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'center',
												mt: 2,
											}}
										>
											<Typography
												variant="subtitle2"
												color={(theme) =>
													theme.palette.text.orange
												}
												gutterBottom
											>
												OPTIONAL
											</Typography>

											<Typography
												variant="h4"
												textAlign="center"
												gutterBottom
											>
												References and Supporting
												Information
											</Typography>

											<Typography
												variant="subtitle"
												textAlign="center"
												color={(theme) =>
													theme.palette.text.grey
												}
												gutterBottom
											>
												Links to extra content or social
												media contacts (maiximum of 7
												entries)
											</Typography>
										</Box>
										<LinkManager
											proposalData={flatProposal}
											setProposalData={setFlatProposal}
										/>
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
												startIcon={
													<IconPencil
														fill={
															theme.palette
																.primary.main
														}
													/>
												}
												sx={{
													borderRadius: '20px',
													mb: { xs: 2, md: 0 },
												}}
												fullWidth={isSmallScreen}
												onClick={() => {
													handleCloseEditDialog();
													handleClose();
												}}
											>
												Back
											</Button>
										</Box>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												gap: 2,
												width: isSmallScreen
													? '100%'
													: 'auto',
											}}
										>
											<Box
												sx={{
													width: '100%',
													mr: 2,
												}}
											>
												<Button
													variant="text"
													sx={{
														borderRadius: '20px',
													}}
													fullWidth
													onClick={async () => {
														await handleSaveDraft();
														handleOpenSaveDraftModal();
														setMounted(false);
													}}
												>
													Save Draft
												</Button>
											</Box>
											<Box
												sx={{
													borderRadius: '20px',
													flexGrow: 1,
												}}
											>
												<Button
													variant="contained"
													sx={{
														borderRadius: '20px',
														whiteSpace: 'nowrap',
													}}
													fullWidth
													onClick={() => {
														handleOpenPublishModal();
													}}
												>
													Publish with new edits
												</Button>
											</Box>
										</Box>
									</Box>

									{/* <Box
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
												startIcon={
													<IconPencil
														fill={
															theme.palette
																.primary.main
														}
													/>
												}
												sx={{
													borderRadius: '20px',
													mb: {
														xs: 2,
														md: 0,
													},
												}}
												fullWidth={isSmallScreen}
												onClick={() => {
													handleCloseEditDialog();
													handleClose();
												}}
											>
												Back
											</Button>
										</Box>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												gap: 2,
											}}
										>
											<Box
												sx={{
													whiteSpace: 'wrap',
													textTransform: 'none',
													width: '100%',
												}}
											>
												<Button
													variant="text"
													sx={{
														borderRadius: '20px',
													}}
													fullWidth
													onClick={async () => {
														await handleSaveDraft();
														handleOpenSaveDraftModal();
													}}
												>
													Save Draft
												</Button>
											</Box>
											<Box
												sx={{
													borderRadius: '20px',
													width: '100%',
													whiteSpace: 'wrap',
													textTransform: 'none',
												}}
											>
												<Button
													variant="contained"
													sx={{
														borderRadius: '20px',
														whiteSpace: 'nowrap', // Prevents text wrapping
													}}
													fullWidth
													onClick={() => {
														handleOpenPublishModal();
													}}
												>
													Publish with new edits
												</Button>
											</Box>
										</Box>
									</Box> */}
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
				<Modal
					open={openSaveDraftModal}
					onClose={handleCloseSaveDraftModal}
				>
					<Box sx={style}>
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
									Proposal saved to drafts
								</Typography>
								<IconButton
									onClick={() => {
										handleCloseSaveDraftModal();
										handleCloseEditDialog();
										handleClose();
										setMounted(false);
									}}
								>
									<IconX width="24px" height="24px" />
								</IconButton>
							</Box>
						</Box>
						<Box
							sx={{
								p: 2,
								display: 'flex',
								justifyContent: 'center',
								alignContent: 'center',
							}}
						>
							<Button
								variant="contained"
								fullWidth
								onClick={() => {
									handleCloseSaveDraftModal();
									handleCloseEditDialog();
									handleClose();
								}}
							>
								Close
							</Button>
						</Box>
					</Box>
				</Modal>
				<Modal
					open={openPublishftModal}
					onClose={handleClosePublishModal}
				>
					<Box sx={style}>
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
									Please confirm applied changes
								</Typography>
								<IconButton
									onClick={() => {
										handleClosePublishModal();
									}}
								>
									<IconX width="24px" height="24px" />
								</IconButton>
							</Box>
						</Box>
						<Box
							sx={{
								p: 2,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignContent: 'center',
								gap: 2,
							}}
						>
							<Button
								variant="contained"
								fullWidth
								onClick={async () => {
									await handleSaveDraft(true);
									handleCloseSaveDraftModal();
									handleCloseEditDialog();
									handleClose();
									setMounted(false);
								}}
							>
								Confirm
							</Button>
							<Button
								variant="outlined"
								fullWidth
								onClick={() => {
									handleClosePublishModal();
								}}
							>
								Cancel
							</Button>
						</Box>
					</Box>
				</Modal>
			</Dialog>
		</Box>
	);
};

export default EditProposalDialog;
