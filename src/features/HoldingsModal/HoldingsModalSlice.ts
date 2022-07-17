import { createSlice } from "@reduxjs/toolkit";

interface State {
    isOpenHM: boolean,
    ui: string
}

const initialState: State = {
    isOpenHM: false,
    ui: 'add'
}

const holdingsSlice = createSlice({
    name: 'holdingsModal',
    initialState,
    reducers: {
        openHM: (state, action) => {
            const {payload} = action;

            state.isOpenHM = true
            state.ui = payload
        },
        closeHM: (state) => {
            state.isOpenHM = false
        }
    }
})

export const {openHM, closeHM} = holdingsSlice.actions;
export default holdingsSlice.reducer;