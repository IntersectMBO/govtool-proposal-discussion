'use client';

import { Grid, Button, Typography, Link } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
import { Step1, Step2, Step3 } from '@/components/ProposalCreationSteps';
import { createProposal } from '@/lib/api';
import { useMediaQuery } from '@mui/material';
import { useRouter } from '@/navigation';
import { useAppContext } from '@/context/context';
const ProposalCreation = () => {
	const router = useRouter();
	const theme = useTheme();
	const { user, setLoading } = useAppContext();
	const [step, setStep] = useState(1);
	const [proposalData, setProposalData] = useState({
		proposal_links: [],
	});

	const [governanceActionTypes, setGovernanceActionTypes] = useState([]);
	const [isContinueDisabled, setIsContinueDisabled] = useState(true);

	const isSmallScreen = useMediaQuery((theme) =>
		theme.breakpoints.down('sm')
	);

	const handleIsContinueDisabled = () => {
		if (
			proposalData?.gov_action_type_id &&
			proposalData?.prop_name &&
			proposalData?.prop_abstract &&
			proposalData?.prop_motivation &&
			proposalData?.prop_rationale &&
			proposalData?.prop_receiving_address &&
			proposalData?.prop_amount
		) {
			setIsContinueDisabled(false);
		} else {
			setIsContinueDisabled(true);
		}
	};

	useEffect(() => {
		handleIsContinueDisabled();
	}, [proposalData]);

	const handleSaveDraft = async (addPoll = false, shouldNavigate = false) => {
		setLoading(true);
		try {
			if (
				!(
					proposalData?.proposal_id &&
					proposalData?.proposal_content_id
				)
			) {
				const { data } = await createProposal(proposalData, addPoll);

				if (
					shouldNavigate &&
					data &&
					data?.attributes &&
					data?.attributes?.proposal_id
				) {
					router.push(
						`/proposed-governance-actions/${data?.attributes?.proposal_id}`
					);
				}

				return data?.attributes?.proposal_id;
			}
		} catch (error) {
			console.error('Error handling the proposal creation:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setProposalData((prev) => ({
			...prev,
			user_id: user?.user?.id,
		}));
	}, [user]);

	return (
		<>
			<Grid
				item
				sx={{
					paddingLeft: '20px',
					borderBottom: `1px solid ${theme.palette.border.gray}`,
				}}
			>
				<Typography variant="h4" component="h1" gutterBottom>
					Proposed a Governance Action
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
					component={Link}
					href="/proposed-governance-actions"
				>
					Show all
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
					{step === 1 && (
						<Step1
							setStep={setStep}
							isContinueDisabled={isContinueDisabled}
							setProposalData={setProposalData}
							handleSaveDraft={handleSaveDraft}
						/>
					)}

					{step === 2 && (
						<Step2
							setStep={setStep}
							proposalData={proposalData}
							setProposalData={setProposalData}
							handleSaveDraft={handleSaveDraft}
							governanceActionTypes={governanceActionTypes}
							setGovernanceActionTypes={setGovernanceActionTypes}
							isSmallScreen={isSmallScreen}
							isContinueDisabled={isContinueDisabled}
						/>
					)}

					{step === 3 && (
						<Step3
							setStep={setStep}
							proposalData={proposalData}
							governanceActionTypes={governanceActionTypes}
							isSmallScreen={isSmallScreen}
							handleSaveDraft={handleSaveDraft}
						/>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default ProposalCreation;
