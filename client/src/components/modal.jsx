import { useState } from 'react';
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
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils';

const BookDetailsModal = ({ open, onClose, bookData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

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
            setLoading(true);
            try {
                const response = await axios.delete(`${baseUrl}/javascript/v1/delete-content/${deleteId}`);
                if (response.status === 200) {
                    toast.success('Deleted');
                    onClose(); // Close modal after deletion
                }
            } catch (error) {
                setError(error.response ? error.response.data : 'An error occurred');
            } finally {
                setLoading(false);
                handleDeleteClose();
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(bookData?.content || '')
            .then(() => {
                setSnackbarMessage('Code copied to clipboard!');
                setSnackbarOpen(true);
            })
            .catch((err) => console.error('Failed to copy: ', err));
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <CircularProgress />
                <Typography variant="h6" color="textSecondary">Loading content...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <Typography variant="h6" color="error">Error loading content: {error}</Typography>
            </Box>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Paper elevation={6} sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                    <Tooltip title="Delete this content" arrow>
                        <IconButton onClick={() => handleDeleteOpen(bookData._id)} aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={handleCopy} aria-label="Copy code">
                        <FileCopyIcon />
                    </IconButton>
                    <IconButton onClick={onClose} aria-label="Close" sx={{ marginLeft: 'auto' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
                    {bookData?.title}
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
                        {bookData?.content}
                    </SyntaxHighlighter>
                </Box>
                <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
                    Output: <strong>{bookData?.output}</strong>
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
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Confirmation Dialog */}
                <Dialog open={dialogOpen} onClose={handleDeleteClose}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this content? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteClose} color="primary">Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Dialog>
    );
};

// Prop validation
BookDetailsModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    bookData: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        output: PropTypes.string.isRequired,
    }).isRequired,
};

export default BookDetailsModal;
