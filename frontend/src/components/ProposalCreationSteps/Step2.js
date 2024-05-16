import { Box, Card, CardContent, Typography, Button, TextField, MenuItem } from '@mui/material';
import { getGovernanceActionTypes } from "@/lib/api";
import { useEffect } from 'react';
import { LinkManager } from '@/components/ProposalCreationSteps';

const Step2 = ({
    setStep,
    proposalData,
    setProposalData,
    handleSaveDraft,
    links,
    setLinks,
    governanceActionTypes,
    setGovernanceActionTypes,
    isSmallScreen,
    isContinueDisabled
}) => {
    const maxLength = 256;

    const fetchGovernanceActionTypes = async () => {
		try {
			const governanceActionTypeList = await getGovernanceActionTypes();

            const mappedData = governanceActionTypeList.data.map(item => ({
                value: item.id,
                label: item.attributes.gov_action_type_name
            }));

            setGovernanceActionTypes(mappedData);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchGovernanceActionTypes();
	}, []);

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                boxShadow: 1, 
                borderRadius: '20px',
                mb: 2,
            }} 
        >
            <CardContent >
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
                        <Typography variant="subtitle2" color={(theme) => theme.palette.text.orange}  gutterBottom>
                            REQUIRED
                        </Typography>

                        <Typography variant="h4" gutterBottom>
                            Proposal Details
                        </Typography>
                        
                        <Typography variant="subtitle" gutterBottom>
                            Subtext to describe something if needed
                        </Typography>
                    </Box>

                    <TextField
                        select
                        label="Governance Action Type"
                        fullWidth
                        required
                        value={proposalData?.gov_action_type_id || ''}
                        onChange={(e) => {
                            setProposalData((prev) => ({
                                ...prev,
                                gov_action_type_id: e.target.value,
                            }));
                        }}
                        >
                        {governanceActionTypes.map((option) => (
                            <MenuItem key={option?.value} value={option?.value}>
                                {option?.label}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
						fullWidth
						label="Title"
						variant="outlined"
						value={proposalData?.prop_name || ''}
						onChange={(e) =>
							setProposalData((prev) => ({
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
                        value={proposalData?.prop_abstract || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                prop_abstract: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant="caption" >
                                    * General Summary of your proposal
                                </Typography>
                                <Typography variant="caption" sx={{ float: 'right' }}>
                                    {`${proposalData?.prop_abstract?.length || 0}/${maxLength}`}
                                </Typography>
                            </>
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: maxLength
                            }
                        }}
                    />

                    <TextField
                        size="large"
                        name="Motivation"
                        label="Motivation"
                        placeholder="Problem this will solve"
                        multiline
                        rows={4}
                        value={proposalData?.prop_motivation || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                prop_motivation: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant="caption" >
                                    * How will this solve a problem
                                </Typography>
                                <Typography variant="caption" sx={{ float: 'right' }}>
                                    {`${proposalData?.prop_motivation?.length || 0}/${maxLength}`}
                                </Typography>
                            </>
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: maxLength  // This enforces the max length
                            }
                        }}
                    />

                    <TextField
                        size="large"
                        name="Rationale"
                        label="Rationale"
                        placeholder="Problem this will solve"
                        multiline
                        rows={4}
                        value={proposalData?.prop_rationale || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                prop_rationale: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant="caption" >
                                    * Put all the content of the Proposal here
                                </Typography>
                                <Typography variant="caption" sx={{ float: 'right' }}>
                                    {`${proposalData?.prop_rationale?.length || 0}/${maxLength}`}
                                </Typography>
                            </>
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: maxLength  // This enforces the max length
                            }
                        }}
                    />

                    <TextField
						fullWidth
						margin="normal"
						label="Receiving address"
						variant="outlined"
						value={proposalData?.prop_receiving_address || ''}
						onChange={(e) =>
							setProposalData((prev) => ({
								...prev,
								prop_receiving_address: e.target.value,
							}))
						}
						required
					/>

                    <TextField
						fullWidth
						margin="normal"
						label="Amount"
                        type='number'
						variant="outlined"
                        placeholder='e.g. 2000'
						value={proposalData?.prop_amount || ''}
						onChange={(e) =>
							setProposalData((prev) => ({
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
                        <Typography variant="subtitle2" color={(theme) => theme.palette.text.orange} gutterBottom>
                            OPTIONAL
                        </Typography>

                        <Typography variant="h4" gutterBottom >
                            References and Supporting Information
                        </Typography>
                        
                        <Typography variant="subtitle" gutterBottom>
                            Links to extra content or social media contacts (maiximum of 7 entries)
                        </Typography>
                    </Box>

                    <LinkManager 
                        links={links}
                        setLinks={setLinks}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: isSmallScreen ? 'center' : 'space-between',
                        mt: 2,
                        gap:2
                    }}
                >
                    <Box>
                        <Button
                            variant="outlined"
                            sx={{borderRadius: '20px'}}
                            onClick={() => setStep(1)}
                        >
                            Back
                        </Button>
                    </Box>

                    <Box 
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2
                        }}
                    >
                        <Button
                            variant="text"
                            sx={{ borderRadius: '20px' }}
                            disabled={isContinueDisabled}
                            onClick={handleSaveDraft}
                        >
                            Save Draft
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: '20px' }}
                            disabled={isContinueDisabled}
                            onClick={() => setStep(3)}
                        >
                            Continue
                        </Button>
                    </Box>

                </Box>
            </CardContent>
        </Card>
    );
};

export default Step2;

