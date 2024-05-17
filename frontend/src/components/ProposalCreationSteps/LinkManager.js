import { useTheme } from '@emotion/react';
import { IconPlus, IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';

const LinkManager = ({ maxLinks = 7, proposalData, setProposalData }) => {
	const theme = useTheme();

	const handleLinkChange = (index, field, value) => {
		const newLinks = proposalData?.proposal_links?.map((link, i) => {
			if (i === index) {
				return { ...link, [field]: value };
			}
			return link;
		});
		setProposalData({
			...proposalData,
			proposal_links: newLinks,
		});
	};

	const handleAddLink = () => {
		if (proposalData?.proposal_links?.length < maxLinks) {
			setProposalData({
				...proposalData,
				proposal_links: [
					...proposalData?.proposal_links,
					{ prop_link: '' },
				],
			});
		}
	};

	const handleRemoveLink = (index) => {
		const newLinks = proposalData?.proposal_links?.filter(
			(_, i) => i !== index
		);
		setProposalData({
			...proposalData,
			proposal_links: newLinks,
		});
	};

	return (
		<Box>
			{proposalData?.proposal_links?.map((link, index) => (
				<Box
					key={index}
					display="flex"
					flexDirection="row"
					p={2}
					mb={2}
					pt={3}
					backgroundColor={(theme) => theme.palette.primary.lightGray}
					position="relative"
				>
					<Box
						display="flex"
						flexDirection="column"
						flexGrow={1}
						gap={2}
					>
						<TextField
							label={`Link #${index + 1} URL`}
							variant="outlined"
							fullWidth
							value={link.prop_link || ''}
							onChange={(e) =>
								handleLinkChange(
									index,
									'prop_link',
									e.target.value
								)
							}
							placeholder="https://website.com"
							sx={{
								background: '#fff',
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: `${theme.palette.border.lightGray}`,
									},
								},
							}}
						/>
						<TextField
							label={`Link #${index + 1} Text`}
							variant="outlined"
							fullWidth
							value={link.prop_link_text || ''}
							onChange={(e) =>
								handleLinkChange(
									index,
									'prop_link_text',
									e.target.value
								)
							}
							placeholder="Text"
							sx={{
								background: '#fff',
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: `${theme.palette.border.lightGray}`,
									},
								},
							}}
						/>
					</Box>

					<IconButton
						onClick={() => handleRemoveLink(index)}
						sx={{
							position: 'absolute',
							top: 0,
							right: 0,
							color: 'gray',
							'&:hover': {
								backgroundColor: 'transparent',
								boxShadow: 'none',
							},
						}}
					>
						<IconX width="16px" height="16px" />
					</IconButton>
				</Box>
			))}
			{proposalData?.proposal_links?.length < maxLinks && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						mt: 2,
					}}
				>
					<Button
						variant="text"
						mt={2}
						startIcon={
							<IconPlus fill={theme.palette.primary.main} />
						}
						onClick={handleAddLink}
					>
						Add link
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default LinkManager;
