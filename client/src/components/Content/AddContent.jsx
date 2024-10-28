import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addContent } from '../../redux/reducers/Content';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';

const ContentForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [output, setOutput] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Dispatch the addContent action with the form data
        dispatch(addContent({ title, content, output }));

        // Reset the form fields after submission
        setTitle('');
        setContent('');
        setOutput('');
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
