import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Modal
} from '@mui/material';
import { useState } from 'react';
import {IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useRouter } from '@/navigation';

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

    const handleCancelAndSaveDraft = () => {
        handleSaveDraft();
        router.push('/');
    };

	const handleCancel = () => {
		setProposalData({});
        router.push('/');
    };

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
                <Modal
                    open={open}
                    onClose={handleClose}
                >
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
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Dialog Title
                                </Typography>
                                <Button onClick={handleClose} >
                                    <IconX width='24px' height='24px' />
                                </Button>
                            </Box>
                            <Typography id="modal-modal-description" mt={2} color={(theme) => theme.palette.text.blueGrey} >
                                A dialog is a type of modal window that appears in front of app content to provide critical information, or prompt for a decision to be made.
                            </Typography>
                        </Box>

                        <Box 
                            display="flex"
                            flexDirection="column"
                            padding={2}
                            gap={2}
                        >
                            <Button 
                                variant="contained"   
                                fullWidth  
                                sx={{
                                    borderRadius: '20px'
                                }}
                                onClick={handleClose} 
                            >
                                I don't want to cancel
                            </Button>
                            <Button 
                                variant="outlined"   
                                fullWidth  
                                sx={{
                                    borderRadius: '20px'
                                }}
                                disabled={isContinueDisabled}
                                onClick={handleCancelAndSaveDraft} 
                            >
                                Yes, cancel & save it as draft
                            </Button>
                            <Button 
                                variant="text"   
                                fullWidth  
                                sx={{
                                    borderRadius: '20px'
                                }}
                                onClick={handleCancel} 
                            >
                                Yes, cancel and don't save it
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </CardContent>
        </Card>
    );
};

export default Step1;

