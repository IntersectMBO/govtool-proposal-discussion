import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Modal
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from '@/navigation';
import { Step1Modal } from '@/components/ProposalCreationSteps';

const Step1 = ({
    setStep,
    isContinueDisabled,
    setProposalData,
    handleSaveDraft,
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
		setOpen(true);
    };

    const handleClose= () => {
		setOpen(false);
    };



    return (
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
            <CardContent 
                sx={{
                    mb: 2,
                    ml: {
                        xs: 2,
                        md: 20,
                    }, 
                    mr: {
                        xs: 2,
                        md: 20,
                    },
                }}
            >
                <Box
                    mb={2} 
                    mt={2}
                >
                    <Typography variant="h4" align="center"  >
                        Step to submit a Governance action
                    </Typography>
                </Box>

                <Box 
                    gap={2} 
                    textAlign="justify" 
                    color={(theme) => theme.palette.text.blueGrey}
                >
                   <ul>
                        <li>
                            <Typography variant="body1" gutterBottom >
                                Before submitting a Governance Action on chain you need to submit a Proposal.
                            </Typography>

                            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold'}} >
                                This allows you to get feedback from the community to refine and improve your proposal, increasing the chances of your Governance Action getting approved, and also building up supporting context in the form of metadata.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" gutterBottom>
                                Once you are happy with your proposal you can open a poll to check ‘Is this proposal ready to be submitted on chain?’
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1" gutterBottom>
                                If you get support on the poll you are ready to submit your proposal on chain as a Governance Action to get voted on.
                            </Typography>
                        </li>
                   </ul> 
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{borderRadius: '20px'}}
                        onClick={handleOpen}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{borderRadius: '20px'}}
                        onClick={() => setStep(2)}
                    >
                        Continue
                    </Button>
                </Box>
               <Step1Modal 
                   open={open}
                   handleClose={handleClose}
                   isContinueDisabled={isContinueDisabled}
                   setProposalData={setProposalData}
                   handleSaveDraft={handleSaveDraft}
                />
            </CardContent>
        </Card>
    );
};

export default Step1;

