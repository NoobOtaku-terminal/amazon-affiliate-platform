import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', userData);
        const { user, tokens } = response.data.data;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return { user, tokens };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const { user, tokens } = response.data.data;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return { user, tokens };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/verify-email', { token });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        tokens: {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken'),
        },
        isAuthenticated: !!localStorage.getItem('accessToken'),
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.tokens = action.payload.tokens;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.tokens = action.payload.tokens;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.tokens = { accessToken: null, refreshToken: null };
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
