import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isHomeOpen: true,
    portfoliosOpen: false
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        openHome: (state) => {
            state.isHomeOpen = true
        },
        closeHome: (state) => {
            state.isHomeOpen = false
        },
        openPortfolios: (state) => {
            state.portfoliosOpen = true
        },
        closePortfolios: (state) => {
            state.portfoliosOpen = false
        }
    }
})

export const {openHome, closeHome, openPortfolios, closePortfolios} = homeSlice.actions;
export default homeSlice.reducer;