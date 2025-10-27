import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchSavedProducts = createAsyncThunk('user/fetchSaved', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/user/saved');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const saveProduct = createAsyncThunk('user/saveProduct', async (productId, { rejectWithValue }) => {
    try {
        const response = await api.post('/user/saved', { productId });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const removeSavedProduct = createAsyncThunk('user/removeSaved', async (productId, { rejectWithValue }) => {
    try {
        await api.delete(`/user/saved/${productId}`);
        return productId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const fetchComparisons = createAsyncThunk('user/fetchComparisons', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/user/comparisons');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const createComparison = createAsyncThunk('user/createComparison', async (productIds, { rejectWithValue }) => {
    try {
        const response = await api.post('/user/comparisons', { productIds });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        savedProducts: [],
        comparisons: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSavedProducts.fulfilled, (state, action) => {
                state.savedProducts = action.payload.savedProducts;
            })
            .addCase(saveProduct.fulfilled, (state, action) => {
                state.savedProducts.unshift(action.payload);
            })
            .addCase(removeSavedProduct.fulfilled, (state, action) => {
                state.savedProducts = state.savedProducts.filter(
                    (item) => item.product.id !== action.payload
                );
            })
            .addCase(fetchComparisons.fulfilled, (state, action) => {
                state.comparisons = action.payload.comparisons;
            })
            .addCase(createComparison.fulfilled, (state, action) => {
                state.comparisons.unshift(action.payload);
            });
    },
});

export default userSlice.reducer;
