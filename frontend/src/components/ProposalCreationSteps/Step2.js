import { Box, Card, CardContent, Typography, Button, TextField, MenuItem } from '@mui/material';
import { getGovernanceActionTypes } from "@/lib/api";
import { useEffect, useState } from 'react';
import { LinkManager } from '@/components/ProposalCreationSteps';

const Step2 = ({
    setStep,
    proposalData,
    setProposalData,
    handleSaveDraft,
    links,
    setLinks
}) => {
    const maxLength = 256;
    const [governanceActionTypes, setGovernanceActionTypes] = useState([]);
    const [isContinueDisabled, setIsContinueDisabled] = useState(true);

    const fetchGovernanceActionTypes = async () => {
		try {
			const governanceActionTypeList = await getGovernanceActionTypes();

            const mappedData = governanceActionTypeList.data.map(item => ({
                value: item.attributes.gov_action_type_name,
                label: item.attributes.gov_action_type_name
            }));

            setGovernanceActionTypes(mappedData);
		} catch (error) {
			console.error(error);
		}
	};

    const handleIsContinueDisabled = () => {
        if(proposalData?.governanceActionType 
            && proposalData?.title 
            && proposalData?.abstract 
            && proposalData?.motivation 
            && proposalData?.rationale 
            && proposalData?.receivingAddress 
            && proposalData?.amount) {  
            setIsContinueDisabled(false);
        } else {    
            setIsContinueDisabled(true);
        }
    }

	useEffect(() => {
		fetchGovernanceActionTypes();
	}, []);

    useEffect(() => {
		handleIsContinueDisabled();
	}, [proposalData]);

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
                        value={proposalData?.governanceActionType || ''}
                        onChange={(e) => {
                            setProposalData((prev) => ({
                                ...prev,
                                governanceActionType: e.target.value,
                            }));
                        }}
                        >
                        {governanceActionTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
						fullWidth
						label="Title"
						variant="outlined"
						value={proposalData?.title || ''}
						onChange={(e) =>
							setProposalData((prev) => ({
								...prev,
								title: e.target.value,
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
                        value={proposalData?.abstract || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                abstract: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant="caption" >
                                    * General Summary of your proposal
                                </Typography>
                                <Typography variant="caption" sx={{ float: 'right' }}>
                                    {`${proposalData?.abstract?.length || 0}/${maxLength}`}
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
                        name="Motivation"
                        label="Motivation"
                        placeholder="Problem this will solve"
                        multiline
                        rows={4}
                        value={proposalData?.motivation || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                motivation: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant="caption" >
                                    * How will this solve a problem
                                </Typography>
                                <Typography variant="caption" sx={{ float: 'right' }}>
                                    {`${proposalData?.motivation?.length || 0}/${maxLength}`}
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
                        value={proposalData?.rationale || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                rationale: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant="caption" >
                                    * Put all the content of the Proposal here
                                </Typography>
                                <Typography variant="caption" sx={{ float: 'right' }}>
                                    {`${proposalData?.rationale?.length || 0}/${maxLength}`}
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
						value={proposalData?.receivingAddress || ''}
						onChange={(e) =>
							setProposalData((prev) => ({
								...prev,
								receivingAddress: e.target.value,
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
						value={proposalData?.amount || ''}
						onChange={(e) =>
							setProposalData((prev) => ({
								...prev,
								amount: e.target.value,
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
                        justifyContent: 'space-between',
                        mt: 2,
                    }}
                >
                    <Box>
                        <Button
                            variant="outlined"
                            sx={{borderRadius: '20px'}}
                            onClick={() => setStep(1)}
                        >
                            Cancel
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

