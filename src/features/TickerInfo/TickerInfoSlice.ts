import { createSlice } from "@reduxjs/toolkit";

const initialState: {isOpenTI: boolean, operation: string} = {
    isOpenTI: false,
    operation: 'Add'
}

const tickerInformationSlice = createSlice({
    name: 'tickerInformation',
    initialState,
    reducers: {
        setAdd: (state) => {state.operation = 'Add'},
        setModify: (state) => {state.operation = 'Modify'},
        openTI: (state) => {
            state.isOpenTI = true
        },
        closeTI: (state) => {
            state.isOpenTI = false
        },
    }
})

export const {setAdd, setModify, openTI, closeTI} = tickerInformationSlice.actions;
export default tickerInformationSlice.reducer;