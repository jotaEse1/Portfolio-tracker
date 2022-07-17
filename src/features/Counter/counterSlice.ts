import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from '../index'

interface State {
    counter: number
}

const initialState: State = {
    counter: 0
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.counter++
        },
        decrement: (state) => {
            state.counter--
        },
        incrementBy: (state, action: PayloadAction<number>) => {
            state.counter += action.payload
        }
    }
})

export const {increment, decrement, incrementBy} = counterSlice.actions;
//export const selectCount = (state: RootState) => state.counter.counter
export default counterSlice.reducer;