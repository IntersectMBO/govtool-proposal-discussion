"use client";

import { Grid, Button,  Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
import { Step1, Step2, Step3 } from '@/components/ProposalCreationSteps';
import { createProposal, createProposalAndProposalContent, updateProposalContent } from "@/lib/api";
import { useMediaQuery } from '@mui/material';

const ProposalCreation = () => {
    const theme = useTheme();
    const [step, setStep] = useState(1);
	const [proposalData, setProposalData] = useState({});
    const [links, setLinks] = useState([]);
	const [governanceActionTypes, setGovernanceActionTypes] = useState([]);
	const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));


	const handleSaveDraft = async () => {
		try {	
			if (!(proposalData?.id && proposalData?.proposal_content_id)) {
				const data = await createProposalAndProposalContent(proposalData, links);

				if (data && data?.attributes?.proposal_id) {
					setProposalData((prev) => ({
						...prev,
						id: data?.attributes?.proposal_id,
						proposal_content_id: data?.id
					}));
	
				} else {
					throw new Error('Failed to obtain an ID from the created proposal');
				}
			} else {
				await updateProposalContent(proposalData, links);
			}
		} catch (error) {
			console.error('Error handling the proposal creation:', error);
		}
	};
		
    return (
		<>
			<Grid
				item
				sx={{
					paddingLeft: "20px",
					borderBottom: `1px solid ${theme.palette.border.gray}`,
				}}
			>
				<Typography variant="h4" component="h1" gutterBottom>
					Proposed a Governance Action
				</Typography>
			</Grid>
			<Grid 
				item
				mt={2}
				mb={2}
			>
				<Button
						size="small"
						startIcon={
							<IconCheveronLeft
								width="18"
								height="18"
								fill={theme.palette.primary.main}
							/>
						}
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
				<Grid
					xs={11}
					md={5}
					item
					zIndex={1}
					maxWidth="940px"
				>
					{step === 1 && (
						<Step1
							setStep={setStep}
						/>
					)}

					{step === 2 && (
						<Step2
							setStep={setStep}
							proposalData={proposalData}
							setProposalData={setProposalData}
							handleSaveDraft={handleSaveDraft}
							links={links}
							setLinks={setLinks}
							governanceActionTypes={governanceActionTypes}
							setGovernanceActionTypes={setGovernanceActionTypes}
							isSmallScreen={isSmallScreen}
						/>
					)}

					{step === 3 && (
						<Step3
							setStep={setStep}
							proposalData={proposalData}
							links={links}
							governanceActionTypes={governanceActionTypes}
							isSmallScreen={isSmallScreen}
						/>
					)}

				</Grid>
			</Grid>
		</>
    );
};

export default ProposalCreation;

