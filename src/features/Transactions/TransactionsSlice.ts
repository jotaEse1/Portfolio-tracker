import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenT: false
}

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        openTransactions: (state) => {
            state.isOpenT = true
        },
        closeTransactions: (state) => {
            state.isOpenT = false
        },
    }
})

export const {openTransactions, closeTransactions} = transactionsSlice.actions;
export default transactionsSlice.reducer;