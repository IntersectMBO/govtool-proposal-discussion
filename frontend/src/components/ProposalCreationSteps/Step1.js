import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
} from '@mui/material';
import { useRouter } from '@/navigation';

const Step1 = ({
    setStep
}) => {
    const router = useRouter();

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                    boxShadow: 1, 
                    borderRadius: '20px',
                    mb: 2,
                    maxWidth: '910px',
                }} 
            >
            <CardContent 
                sx={{
                    pb: 2,
                    pl: {
                        xs: 2,
                        md: 20,
                    }, 
                    pr: {
                        xs: 2,
                        md: 20,
                    },
                }}
            >
                <Typography variant="h4" align="justify" mb={2} mt={2}>
                    Step to submit a Governance action
                </Typography>

                <Box gap={2} textAlign="justify" color={(theme) => theme.palette.text.blueGrey}>
                   
                    <Typography variant="body1" gutterBottom >
                        Before submitting a Governance Action on chain you need to submit a Proposal.
                    </Typography>

                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold'}} >
                        This allows you to get feedback from the community to refine and improve your proposal, increasing the chances of your Governance Action getting approved, and also building up supporting context in the form of metadata.
                    </Typography>
                    
                    <Typography variant="body1" gutterBottom>
                        Once you are happy with your proposal you can open a poll to check ‘Is this proposal ready to be submitted on chain?’
                    </Typography>
                    
                    <Typography variant="body1" gutterBottom>
                        If you get support on the poll you are ready to submit your proposal on chain as a Governance Action to get voted on.
                    </Typography>
                   
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
                        onClick={() => router.push('/')}
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
            </CardContent>
        </Card>
    );
};

export default Step1;

