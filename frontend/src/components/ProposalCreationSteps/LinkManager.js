import { Button, TextField, Box } from '@mui/material';
import { IconPlus } from "@intersect.mbo/intersectmbo.org-icons-set";
import { useTheme } from '@emotion/react';

const LinkManager = ({ maxLinks = 7, links, setLinks }) => {
    const theme = useTheme();

    const handleLinkChange = (index, field, value) => {
        const newLinks = links.map((link, i) => {
            if (i === index) {
                return { ...link, [field]: value };
            }
            return link;
        });
        setLinks(newLinks);
    };

    const addLink = () => {
        if (links.length < maxLinks) {
            setLinks([...links, { url: '', text: '' }]);
        }
    };

    const removeLink = (index) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    return (
        <Box >
            {links.map((link, index) => (
                <Box 
                    key={index} 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: 2,   
                        p: 2,
                        mt: 2,
                        background: "#F3F4F8",
                    }}
                >
                    <TextField
                        label={`Link #${index+1} URL`}
                        variant="outlined"
                        fullWidth
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        placeholder="https://website.com"
                        sx={{ 
                            background: "#fff",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#E7EAF2", // Set the default border color
                                }
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label={`Link #${index+1} Text`} 
                        variant="outlined"
                        fullWidth
                        value={link.text}
                        onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                        placeholder="Text"
                        sx={{ 
                            background: "#fff",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#E7EAF2", // Set the default border color
                                }
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
            ))}
            {links.length < maxLinks && (
                <Box   
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2
                    }} 
                >
                    <Button variant="text" mt={2} startIcon={<IconPlus fill={theme.palette.primary.main} />} onClick={addLink} >
                        Add link
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default LinkManager;
