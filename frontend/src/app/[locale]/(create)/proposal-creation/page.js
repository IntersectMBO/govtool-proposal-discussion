"use client";

import { Grid, Button, Box, Typography, Card } from '@mui/material';
import React, { useState } from 'react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
import { Step1, Step2, Step3 } from '@/components/ProposalCreationSteps';

const ProposalCreation = () => {
    const theme = useTheme();
    const [step, setStep] = useState(1);
	const [proposalData, setProposalData] = useState({});

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

