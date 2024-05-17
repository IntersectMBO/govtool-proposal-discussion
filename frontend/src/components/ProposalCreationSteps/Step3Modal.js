import { useRouter } from '@/navigation';
import { IconClock, IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useState } from 'react';

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

const AddPollModal = ({ handleSaveDraft }) => {
	const router = useRouter();

	const [openChildModal, setOpenChildModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [proposalId, setProposalId] = useState(null);

	const handleOpenChildModal = () => {
		setOpenChildModal(true);
	};
	const handleCloseChildModal = () => {
		setOpenChildModal(false);
	};

	const saveDraft = async () => {
		setIsSaving(true);
		handleOpenChildModal();

		const newProposalId = await handleSaveDraft(true, false);
		setProposalId(newProposalId);

		setIsSaving(false);
	};

	return (
		<Box>
			<Box display="flex" flexDirection="column" padding={2} gap={2}>
				<Button
					variant="contained"
					fullWidth
					sx={{
						borderRadius: '20px',
					}}
					onClick={saveDraft}
				>
					Add poll
				</Button>
				<Button
					variant="outlined"
					fullWidth
					sx={{
						borderRadius: '20px',
					}}
					onClick={() => {
						handleSaveDraft(false, true);
					}}
				>
					Submit without Poll
				</Button>
			</Box>
			<Modal open={openChildModal} onClose={handleCloseChildModal}>
				<Box
					sx={style}
					display="flex"
					flexDirection="column"
					padding={2}
					gap={2}
				>
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="space-between"
					>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
						>
							Proposal submitted!
						</Typography>
						<Typography
							id="modal-modal-description"
							mt={2}
							color={(theme) => theme.palette.text.grey}
						>
							Now you can check your proposal
						</Typography>
					</Box>
					<Button
						variant="contained"
						fullWidth
						sx={{
							borderRadius: '20px',
						}}
						disabled={isSaving}
						onClick={() => {
							if (proposalId) {
								router.push(
									`/proposed-governance-actions/${proposalId}`
								);
							} else {
								console.error(
									'No proposal ID available for navigation'
								);
							}
						}}
					>
						{isSaving ? <IconClock /> : null} Go to my proposal
					</Button>
				</Box>
			</Modal>
		</Box>
	);
};

const Step3Modal = ({ open, handleClose, handleSaveDraft }) => {
	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={style}>
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
					>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
						>
							We recommend to add poll first
						</Typography>
						<Button onClick={handleClose}>
							<IconX width="24px" height="24px" />
						</Button>
					</Box>
					<Typography
						id="modal-modal-description"
						mt={2}
						color={(theme) => theme.palette.text.grey}
					>
						Is this proposal ready to be submitted on chain?
						Community can help the proposer making the proposal
						better.
					</Typography>
				</Box>
				<AddPollModal handleSaveDraft={handleSaveDraft} />
			</Box>
		</Modal>
	);
};

export default Step3Modal;
