import { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { baseUrl } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import BookDetailsModal from './modal';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const Suggestions = styled('div')(({ theme }) => ({
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    zIndex: 1,
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function SearchAppBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/javascript/v1/get-content`);
                setData(response.data);
            } catch (error) {
                toast.error(error.response ? error.response.data : 'An error occurred');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            const results = data.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredData(results);
        }
    }, [searchQuery, data]);

    const handleSuggestionClick = (bookData) => {
        setSelectedBook(bookData);
        setModalOpen(true);
        setSearchQuery('');
    };

    const handleMenuToggle = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBook(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={handleMenuToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        NoteBook
                    </Typography>

                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && filteredData.length > 0 && (
                            <Suggestions>
                                {filteredData.map((item) => (
                                    <Typography
                                        key={item._id}
                                        variant="body2"
                                        sx={{ padding: '8px', cursor: 'pointer', color: 'black' }}
                                        onClick={() => handleSuggestionClick(item)}
                                    >
                                        {item.title}
                                    </Typography>
                                ))}
                            </Suggestions>
                        )}
                    </Search>
                </Toolbar>
            </AppBar>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose} component="a" href="/add-notes">
                    Add Notes
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component="a" href="/">
                    Home
                </MenuItem>
            </Menu>
            <BookDetailsModal open={modalOpen} onClose={handleCloseModal} bookData={selectedBook} />
        </Box>
    );
}
