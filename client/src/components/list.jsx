import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { baseUrl } from '../utils';
import { Box, List as ChartList, ListItem, Typography, Pagination, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function List() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseUrl}/javascript/v1/get-content`, {
                    params: {
                        page: currentPage,
                        per_page: itemsPerPage,
                    },
                });

                setList(response.data);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleNavigate = (title) => {
        sessionStorage.setItem('query', title);
        navigate('/question');
    };

    return (
        <Box sx={{ padding: { xs: 2, sm: 3 }, width: 'auto', overflow: 'hidden' }}>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && (
                <ChartList sx={{
                    width: 'auto',
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: 2,
                    padding: { xs: 1, sm: 2 },
                    overflow: 'hidden', // Ensure no overflow in the list
                }}>
                    {list?.map((item, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                padding: { xs: '10px', sm: '16px' },
                                borderBottom: index === list.length - 1 ? 'none' : '1px solid #ddd',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                                width: '100%', // Prevent ListItem from stretching too far
                                overflow: 'hidden', // Ensure no overflow for list items
                            }}
                            onClick={() => handleNavigate(item.title)}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    flex: 1,
                                    fontSize: { xs: '14px', sm: '16px' }, // Responsive font size
                                    overflow: 'hidden', // Prevent text overflow
                                    textOverflow: 'ellipsis', // Add ellipsis for overflow text
                                    whiteSpace: 'nowrap', // Prevent text from wrapping
                                    maxWidth: 'auto', // Prevent text from going beyond the container
                                }}
                            >
                                {item.title}
                            </Typography>
                        </ListItem>
                    ))}
                </ChartList>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3, width: '100%' }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    siblingCount={1}
                    boundaryCount={2}
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontSize: { xs: '0.8rem', sm: '1rem' }, // Adjust pagination size for mobile
                        },
                    }}
                />
            </Box>
        </Box>
    );
}
