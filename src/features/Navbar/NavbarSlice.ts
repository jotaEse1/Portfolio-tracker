import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isMenuOpen: false
}

const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        openMenu: (state) => {state.isMenuOpen = true},
        closeMenu: (state) => {state.isMenuOpen = false}
    }
})

export const {openMenu, closeMenu} = navbarSlice.actions;
export default navbarSlice.reducer;