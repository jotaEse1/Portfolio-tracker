import { createSlice } from "@reduxjs/toolkit";

interface State {
    rowPM: {
        id: string,
        name: string,
        purchaseDate: string,
        purchasePrice: number,
        purchaseStocks: number
    }
}

const initialState: State = {
    rowPM: {
        id: '',
        name: '',
        purchaseDate: '',
        purchasePrice: 0,
        purchaseStocks: 0
    }
}

const pmRowSlice = createSlice({
    name: 'PMRow',
    initialState,
    reducers: {
        setPMRow: (state, action) => {
            const {payload} = action;
            state.rowPM = payload
        }
    }
})

export const {setPMRow} = pmRowSlice.actions;
export default pmRowSlice.reducer;