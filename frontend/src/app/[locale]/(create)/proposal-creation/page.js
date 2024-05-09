"use client";

import { Grid, Button,  Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
import { Step1, Step2, Step3 } from '@/components/ProposalCreationSteps';
import { createProposal, createProposalContent} from "@/lib/api";

const ProposalCreation = () => {
    const theme = useTheme();
    const [step, setStep] = useState(1);
	const [proposalData, setProposalData] = useState({});
    const [links, setLinks] = useState([]);

	const handleSaveDraft = async () => {
		try {
			if (!proposalData.id) {
				const data = await createProposal();
	
				if (data && data.id) {
					setProposalData((prev) => ({
						...prev,
						id: data.id
					}));
				} 

			}


			const contentData = await createProposalContent(proposalData);

			console.log(contentData)




		} catch (error) {
			console.error('Error creating proposal:', error);
		}
	};
	
	console.log(proposalData)
		
	useEffect(() => {
		if (proposalData.id) {
			console.log("Draft saved", proposalData.id);
		}
	}, [proposalData.id]);
	
	
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
						/>
					)}

					{step === 3 && (
						<Step3
							setStep={setStep}
							proposalData={proposalData}
						/>
					)}

				</Grid>
			</Grid>
		</>
    );
};

export default ProposalCreation;

