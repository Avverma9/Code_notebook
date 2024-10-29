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

                // Reset the form fields after successful submission
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
            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '8px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Add Content
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="title"
                                label="Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                inputProps={{ style: { padding: '10px' } }} // Increase padding for a better look
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="content"
                                label="Content"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                inputProps={{ style: { padding: '10px' } }} // Increase padding for a better look
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="output"
                                label="Output"
                                variant="outlined"
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                inputProps={{ style: { padding: '10px' } }} // Increase padding for a better look
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
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
