import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActionType {
    period: string, 
    method: string
}

const initialState = {
    _1M: '%',
    _3M: '%',
    _6M: '%',
    YTD: '%',
    SI: '%'
}

const panelSlice = createSlice({
    name: 'panel',
    initialState,
    reducers: {
        changeSquare: (state, action: PayloadAction<ActionType>) => {
            const {payload: {period, method}} = action;

            state[period] = method
        }
    }
})

export const {changeSquare} = panelSlice.actions;
export default panelSlice.reducer;