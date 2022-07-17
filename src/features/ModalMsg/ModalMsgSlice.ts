import { createSlice } from "@reduxjs/toolkit";

interface State {
    msg: string,
    isOpenMM: boolean
}

const initialState: State = {
    msg: 'An error ocurred',
    isOpenMM: false
}

const msgSlice = createSlice({
    name: 'ModalMsg',
    initialState,
    reducers: {
        setMsg: (state, action) => {
            state.msg = action.payload
        },
        openMM: (state) => {
            state.isOpenMM = true
        },
        closeMM: (state) => {
            state.isOpenMM = false
        },

    }
})

export const { setMsg, openMM, closeMM } = msgSlice.actions;
export default msgSlice.reducer;