import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils';
import { toast } from 'react-toastify';

export const fetchContent = createAsyncThunk('content/fetchContent', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${baseUrl}/javascript/v1/get-content`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
});

export const addContent = createAsyncThunk('content/addContent', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${baseUrl}/javascript/v1/push-content`, data);
        if (response.status === 201) {
            toast.success('Added data');
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
});
export const deleteContent = createAsyncThunk('content/fetchContent', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${baseUrl}/javascript/v1/delete-content/${id}`);
        if (response.status === 201) {
            toast.success('Deleted data');
        }
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
});

const contentSlice = createSlice({
    name: 'content',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContent.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default contentSlice.reducer;
