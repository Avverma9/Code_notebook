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
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import { toast } from 'react-toastify'; // Ensure toast is imported
import { baseUrl } from '../utils';

const Content = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState([]); // Define data state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/javascript/v1/get-content`);
                setData(response.data); // Store fetched data
            } catch (error) {
                setError(error.response ? error.response.data : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                    setData((prevData) => prevData.filter((item) => item._id !== deleteId)); // Update state to remove deleted item
                }
            } catch (error) {
                setError(error.response ? error.response.data : 'An error occurred');
            } finally {
                handleDeleteClose();
            }
        }
    };

    const path = location.pathname;

    if (path !== '/' && path !== '/view-search-data') {
        return null; // Render nothing if not on the correct path
    }

    const handleNextPage = () => {
        if (currentPage < data.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleCopy = () => {
        navigator.clipboard
            .writeText(data[currentPage]?.content || '')
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

    if (!data || data.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    No content available.
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
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <Tooltip title="Delete this content" arrow>
                    <IconButton onClick={() => handleDeleteOpen(data[currentPage]._id)} aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
               <h3> {data[currentPage]?.title}</h3>
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
                    height: '450px', // Set a fixed height
                    overflowY: 'auto', // Allow vertical scrolling
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
                    {data[currentPage]?.content}
                </SyntaxHighlighter>
            </Box>

            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
                Output: <strong>{data[currentPage]?.output}</strong>
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between',  }}>
                <Tooltip title="Previous page" arrow>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        aria-label="Previous page"
                        startIcon={<NavigateBeforeIcon />}
                        sx={{
                            flex: 1,
                            marginRight: 1,
                            '&:hover': {
                                backgroundColor: '#e3f2fd',
                            },
                        }}
                    >
                        Previous
                    </Button>
                </Tooltip>
                <Tooltip title="Next page" arrow>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextPage}
                        disabled={currentPage === data.length - 1}
                        aria-label="Next page"
                        endIcon={<NavigateNextIcon />}
                        sx={{
                            flex: 1,
                            marginLeft: 1,
                            '&:hover': {
                                backgroundColor: '#bbdefb',
                            },
                        }}
                    >
                        Next
                    </Button>
                </Tooltip>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ backgroundColor: 'transparent' }}
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

            {/* Confirmation Dialog */}
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

// Prop validation
Content.propTypes = {
    bookData: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            output: PropTypes.string.isRequired,
        })
    ),
};

export default Content;
