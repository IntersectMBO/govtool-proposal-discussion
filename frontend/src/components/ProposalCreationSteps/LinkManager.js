import { Button, TextField, Box } from '@mui/material';
import { IconPlus } from "@intersect.mbo/intersectmbo.org-icons-set";
import { useTheme } from '@emotion/react';
import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set'
import IconButton from '@mui/material/IconButton';

const LinkManager = ({ maxLinks = 7, links, setLinks }) => {
    const theme = useTheme();

    const handleLinkChange = (index, value) => {
        const newLinks = links.map((link, i) => {
            if (i === index) {
                return { ...link, prop_link: value };
            }
            return link;
        });
        setLinks(newLinks);
    };

    const handleAddLink = () => {
        if (links.length < maxLinks) {
            setLinks([...links, { prop_link: ''}]);
        }
    };

    const handleRemoveLink = (index) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    return (
        <Box >
            {links.map((link, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}> 
                    <TextField
                        
                        label={`Link #${index + 1} URL`}
                        variant="outlined"
                        fullWidth
                        value={link.prop_link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        placeholder="https://website.com"
                        sx={{
                            background: "#fff",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#E7EAF2",
                                    borderRadius: '30px'
                                }
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <IconButton
                        onClick={() => handleRemoveLink(index)} 
                        sx={{
                            position: 'absolute',
                            right: 8, 
                            top: 8, 
                            color: 'gray'
                        }}
                    >
                        <IconX />
                    </IconButton>
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
                    <Button variant="text" mt={2} startIcon={<IconPlus fill={theme.palette.primary.main} />} onClick={handleAddLink} >
                        Add link
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default LinkManager;
