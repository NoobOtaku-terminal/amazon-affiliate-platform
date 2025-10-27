import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProductReviews = createAsyncThunk('reviews/fetchProduct', async (params, { rejectWithValue }) => {
    try {
        const response = await api.get('/reviews/product', { params });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const createReview = createAsyncThunk('reviews/create', async (reviewData, { rejectWithValue }) => {
    try {
        const response = await api.post('/reviews', reviewData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        items: [],
        ratingStats: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.items = action.payload.reviews;
                state.ratingStats = action.payload.ratingStats;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            });
    },
});

export default reviewSlice.reducer;
