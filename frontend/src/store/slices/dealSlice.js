import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchDeals = createAsyncThunk('deals/fetchAll', async (params = {}, { rejectWithValue }) => {
    try {
        const response = await api.get('/deals', { params });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const fetchHotDeals = createAsyncThunk('deals/fetchHot', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/deals/hot');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const dealSlice = createSlice({
    name: 'deals',
    initialState: {
        items: [],
        hotDeals: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.items = action.payload.deals;
            })
            .addCase(fetchHotDeals.fulfilled, (state, action) => {
                state.hotDeals = action.payload;
            });
    },
});

export default dealSlice.reducer;
