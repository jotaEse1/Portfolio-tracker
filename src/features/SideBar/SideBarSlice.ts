import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

const initialState = {
    sidebarOpen: false,
    optionsPortfolioOpen: false,
    optionsHoldingsOpen: false
}

const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState,
    reducers: {
        openBar: (state) => {
            state.sidebarOpen = true
        },
        closeBar: (state) => {
            state.sidebarOpen = false
        },
        openPortfolio: (state) => {
            state.optionsPortfolioOpen = true
        },
        closePortfolio: (state) => {
            state.optionsPortfolioOpen = false
        },
        openHoldings: (state) => {
            state.optionsHoldingsOpen = true
        },
        closeHoldings: (state) => {
            state.optionsHoldingsOpen = false
        }
    }
})

export const {openBar, closeBar, openPortfolio, closePortfolio, openHoldings, closeHoldings} = sideBarSlice.actions;
export const sideBarModal = (state: RootState) => state.sideBar.sidebarOpen
export default sideBarSlice.reducer;