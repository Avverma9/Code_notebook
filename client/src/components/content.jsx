import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Tooltip,
    IconButton,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils';
import { useNavigate } from 'react-router-dom';

const Content = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    // Function to go back to the previous page
    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get the query from sessionStorage and decode it
                const query = decodeURIComponent(sessionStorage.getItem('query')); // Decoding %20 to space
                const response = await axios.get(`${baseUrl}/javascript/v1/get-content/by/title?title=${query}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response ? error.response.data : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Only run once when the component mounts

    const handleDeleteOpen = (id) => {
        setDeleteId(id);
        setDialogOpen(true);
    };

    const handleDeleteClose = () => {
        setDialogOpen(false);
        setDeleteId(null);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                const response = await axios.delete(`${baseUrl}/javascript/v1/delete-content/${deleteId}`);
                if (response.status === 200) {
                    toast.success('Deleted');
                    setData((prevData) => prevData.filter((item) => item._id !== deleteId));
                }
            } catch (error) {
                setError(error.response ? error.response.data : 'An error occurred');
            } finally {
                handleDeleteClose();
            }
        }
    };

    const handleCopy = () => {
        const contentToCopy = data?.content || '';
        navigator.clipboard
            .writeText(contentToCopy)
            .then(() => {
                setSnackbarMessage('Code copied to clipboard!');
                setSnackbarOpen(true);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <CircularProgress />
                <Typography variant="h6" color="textSecondary">
                    Loading content...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <Typography variant="h6" color="error">
                    Error loading content: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={6}
            sx={{
                maxWidth: { xs: '90%', sm: '800px' },
                margin: 'auto',
                borderRadius: 4,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                padding: 2,
            }}
        >
            {/* Go Back Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
                <Button
                    onClick={goBack}
                    variant="outlined"
                    color="primary"
                    sx={{
                        marginRight: 2, // Adds spacing to the right of the button
                        fontWeight: 600,
                        padding: '8px 16px', // Adds padding for a better click area
                        borderRadius: 4, // Rounded corners for the button
                    }}
                >
                    Go Back
                </Button>
            </Box>

            {/* Content Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <Tooltip title="Delete this content" arrow>
                    <IconButton onClick={() => handleDeleteOpen(data._id)} aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
                    {data?.title}
                </Typography>
                <IconButton onClick={handleCopy} aria-label="Copy code">
                    <FileCopyIcon />
                </IconButton>
            </Box>

            <Box
                sx={{
                    overflow: 'hidden',
                    marginBottom: 2,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    height: '450px',
                    overflowY: 'auto',
                }}
            >
                <SyntaxHighlighter
                    language="javascript"
                    style={solarizedlight}
                    customStyle={{
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                    }}
                >
                    {data?.content} {/* Display the code content */}
                </SyntaxHighlighter>
            </Box>

            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
                Output: <strong>{data?.output}</strong> {/* Display the output */}
            </Typography>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog open={dialogOpen} onClose={handleDeleteClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this content? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Content;
