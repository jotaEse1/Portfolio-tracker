import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPage: 1
}

const paginationPMSlice = createSlice({
    name: 'paginationPM',
    initialState,
    reducers: {
        incrementPage: (state) => {state.currentPage++},
        decrementPage: (state) => {state.currentPage--}
    }
})

export const {incrementPage, decrementPage} = paginationPMSlice.actions;
export default paginationPMSlice.reducer;