import { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils';

const ContentForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [output, setOutput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseUrl}/javascript/v1/push-content`, {
                title,
                content,
                output,
            });
            if (response.status === 201) {
                toast.success('Content added successfully!');
                setTitle('');
                setContent('');
                setOutput('');
            }
        } catch (error) {
            toast.error(error.response ? error.response.data : 'An error occurred');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={6} sx={{ padding: { xs: '2rem', sm: '3rem' }, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: '#333',
                        fontSize: { xs: '1.5rem', sm: '2rem' }, // Responsive font size
                    }}
                >
                    Add New Content
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="title"
                                label="Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                inputProps={{
                                    style: {
                                        padding: '14px 16px',
                                        fontSize: '16px',
                                    },
                                }}
                                sx={{
                                    marginBottom: { xs: '1rem', sm: '1.5rem' }, // Adjust margin for different screen sizes
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="content"
                                label="Content"
                                variant="outlined"
                                multiline
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                inputProps={{
                                    style: {
                                        padding: '14px 16px',
                                        fontSize: '16px',
                                    },
                                }}
                                sx={{
                                    marginBottom: { xs: '1rem', sm: '1.5rem' },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="output"
                                label="Output (Optional)"
                                variant="outlined"
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                inputProps={{
                                    style: {
                                        padding: '14px 16px',
                                        fontSize: '16px',
                                    },
                                }}
                                sx={{
                                    marginBottom: { xs: '1rem', sm: '1.5rem' },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                sx={{
                                    padding: '12px 0',
                                    fontSize: { xs: '14px', sm: '16px' }, // Adjust button text size for smaller screens
                                    textTransform: 'none',
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    },
                                }}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default ContentForm;
