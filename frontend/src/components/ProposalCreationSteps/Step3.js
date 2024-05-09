import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { IconPencil } from "@intersect.mbo/intersectmbo.org-icons-set";
import { useTheme } from '@emotion/react';

const Step3 = ({
    setStep,
    proposalData
}) => {
    const theme = useTheme();

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                boxShadow: 1, 
                borderRadius: '20px',
                mb: 2,
                minWidth: '910px',
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
                        <Typography variant="h4" gutterBottom>
                            Review Your Submission
                        </Typography>
                        
                        <Typography variant="subtitle" gutterBottom>
                            Subtext to describe something if needed
                        </Typography>
                    </Box>

                        <Typography variant="h5" gutterBottom>
                            {proposalData.title}
                        </Typography>

                        <Box> 
                            <Typography variant="h6" gutterBottom>
                                Goverance Action Type
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {proposalData.governanceActionType}
                            </Typography>
                        </Box>
                   
   
                        <Box> 
                            <Typography variant="h6" gutterBottom>
                                Abstrtact
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {proposalData.abstract}
                            </Typography>
                        </Box>

                        <Box> 
                            <Typography variant="h6" gutterBottom>
                                Motivation
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {proposalData.motivation}
                            </Typography>
                        </Box>

                        <Box> 
                            <Typography variant="h6" gutterBottom>
                                Rationale
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {proposalData.rationale}
                            </Typography>
                        </Box>

                        <Box> 
                            <Typography variant="h6" gutterBottom>
                                Supporting links
                            </Typography>
                            
                        </Box>
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
                            startIcon={<IconPencil fill={theme.palette.primary.main}/>}
                            sx={{borderRadius: '20px'}}
                            onClick={() => setStep(2)}
                        >
                            Back to editing
                        </Button>
                    </Box>


                    <Box 
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2, // this adds space between any child elements
                        }}
                    >
                        <Button
                            variant="text"
                            sx={{ borderRadius: '20px' }}
                
                        >
                            Save Draft
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: '20px' }}
                        
                        >
                            Submit
                        </Button>
                    </Box>

                    
                </Box>
            </CardContent>
        </Card>
    );
};

export default Step3;

