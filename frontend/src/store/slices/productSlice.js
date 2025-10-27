import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
    try {
        const response = await api.get('/products', { params });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const searchProducts = createAsyncThunk('products/search', async (query, { rejectWithValue }) => {
    try {
        const response = await api.get('/products/search', { params: { q: query } });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        currentProduct: null,
        pagination: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.currentProduct = action.payload;
            });
    },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
