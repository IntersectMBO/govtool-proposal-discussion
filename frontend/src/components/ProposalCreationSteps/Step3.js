import { Box, Card, CardContent, Typography, Button, ListItem, ListItemIcon, List , Link} from '@mui/material';
import { IconPencil } from "@intersect.mbo/intersectmbo.org-icons-set";
import { useTheme } from '@emotion/react';
import {IconLink} from '@intersect.mbo/intersectmbo.org-icons-set'


const Step3 = ({
    setStep,
    proposalData,
    links,
    governanceActionTypes,
    isSmallScreen
}) => {
    const theme = useTheme();

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
                            mb: 4
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
                            {proposalData?.prop_name}
                        </Typography>

                        <Box> 
                            <Typography 
                                variant="body1" 
                                color={(theme) => theme.palette.text.blueGrey}
                                gutterBottom
                            >
                                Goverance Action Type
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {governanceActionTypes.find(x => x.value === proposalData?.gov_action_type_id).label}
                            </Typography>
                        </Box>
                   
   
                        <Box> 
                            <Typography 
                                variant="body1" 
                                color={(theme) => theme.palette.text.blueGrey}
                                gutterBottom
                            >
                                Abstrtact
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {proposalData?.prop_abstract}
                            </Typography>
                        </Box>

                        <Box> 
                            <Typography 
                                variant="body1" 
                                color={(theme) => theme.palette.text.blueGrey}
                                gutterBottom
                            >
                                Motivation
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {proposalData?.prop_motivation}
                            </Typography>
                        </Box>

                        <Box> 
                            <Typography 
                                variant="body1" 
                                color={(theme) => theme.palette.text.blueGrey}
                                gutterBottom
                            >
                                Rationale
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {proposalData?.prop_rationale}
                            </Typography>
                        </Box>

                        <Box> 
                            <Typography 
                                variant="body1" 
                                color={(theme) => theme.palette.text.blueGrey}
                                gutterBottom
                            >
                                Supporting links
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={2}>
                                {
                                    links?.map((link, index) => (
                                        <Box 
                                            key={index} 
                                            display="flex" 	
                                            flexDirection="flex-start"
                                            alignContent="center" 
                                        >
                                            <IconLink />
                                            <Typography key={index} variant="body1" gutterBottom>
                                                {link?.prop_link}
                                            </Typography>
                                        </Box>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
      
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            justifyContent: 'space-between',
                            mt: 10,
                        }}
                    >
                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<IconPencil fill={theme.palette.primary.main}/>}
                                sx={{
                                    borderRadius: '20px',
                                    mb: {
                                        xs: 2,
                                        md: 0,
                                    }
                                }}
                                fullWidth={isSmallScreen}
                                onClick={() => setStep(2)}
                            >
                                Back to editing
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
                                sx={{ 
                                    borderRadius: '20px',
                                }}
                            >
                                Save Draft
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ 
                                    borderRadius: '20px',
                                }}
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

