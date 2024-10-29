import { useState } from 'react';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';
import axios from 'axios'; // Ensure axios is imported
import { toast } from 'react-toastify'; // Ensure toast is imported
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
            <Typography variant="h4" gutterBottom>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default ContentForm;
