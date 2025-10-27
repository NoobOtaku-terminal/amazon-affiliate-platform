import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        sidebarOpen: false,
        modal: {
            isOpen: false,
            type: null,
            data: null,
        },
        toast: {
            isVisible: false,
            message: '',
            type: 'info',
        },
        theme: localStorage.getItem('theme') || 'light',
    },
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        openModal: (state, action) => {
            state.modal = {
                isOpen: true,
                type: action.payload.type,
                data: action.payload.data,
            };
        },
        closeModal: (state) => {
            state.modal = {
                isOpen: false,
                type: null,
                data: null,
            };
        },
        showToast: (state, action) => {
            state.toast = {
                isVisible: true,
                message: action.payload.message,
                type: action.payload.type || 'info',
            };
        },
        hideToast: (state) => {
            state.toast.isVisible = false;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
    },
});

export const { toggleSidebar, openModal, closeModal, showToast, hideToast, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
