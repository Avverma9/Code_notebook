import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Tooltip, IconButton, Snackbar, Alert } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContent, fetchContent } from '../../redux/reducers/Content';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useLocation } from 'react-router-dom';

const Content = ({ bookData }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.content);
    const location = useLocation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Determine which data to display
    const displayData = bookData && bookData.length > 0 ? bookData : data;

    useEffect(() => {
        // Fetch content only if bookData is not provided
        if (!bookData) {
            dispatch(fetchContent());
        } else {
            // If bookData is received, reset the current page
            setCurrentPage(0);
        }
    }, [dispatch, bookData]);

    const handleDelete = async (id) => {
        await dispatch(deleteContent(id));
        // Adjust current page after deletion
        if (currentPage > 0 && displayData.length === 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
    };
    const path = location.pathname;

    if (path !== '/' && path !== '/view-search-data') {
        return null; // Render nothing if not on the correct path
    }

    const handleNextPage = () => {
        if (currentPage < displayData.length - 1) {
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
            .writeText(displayData[currentPage]?.content || '')
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

    if (loading && !bookData) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <CircularProgress />
                <Typography variant="h6" color="textSecondary">
                    Loading content...
                </Typography>
            </Box>
        );
    }

    if (error && !bookData) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <Typography variant="h6" color="error">
                    Error loading content: {error.message}
                </Typography>
            </Box>
        );
    }

    if (!displayData || displayData.length === 0) {
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
                marginTop: '50px',
                borderRadius: 4,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                position: 'relative',
            }}
        >
            <IconButton sx={{ position: 'absolute', top: 16, right: 16 }} onClick={handleCopy} aria-label="Copy code">
                <FileCopyIcon />
            </IconButton>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
                {displayData[currentPage]?.title}
            </Typography>
            <Box
                sx={{
                    overflow: 'hidden',
                    marginBottom: 2,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
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
                    {displayData[currentPage]?.content}
                </SyntaxHighlighter>
            </Box>
            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
                Output: <strong>{displayData[currentPage]?.output}</strong>
            </Typography>

            <Tooltip title="Delete this content" arrow>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(displayData[currentPage]._id)}
                    startIcon={<DeleteIcon />}
                    sx={{
                        marginBottom: 2,
                        '&:hover': {
                            backgroundColor: '#d32f2f',
                        },
                    }}
                >
                    Delete
                </Button>
            </Tooltip>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
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
                        disabled={currentPage === displayData.length - 1}
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
