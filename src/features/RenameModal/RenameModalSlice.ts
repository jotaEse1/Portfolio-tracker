import { createSlice } from "@reduxjs/toolkit";

interface State {
    isRenameOpen: boolean,
    optAction: 'retire' | 'rename' | 'delete'
}

const initialState: State = {
    isRenameOpen: false,
    optAction: 'rename'
}

const renameSlice = createSlice({
    name: 'renameModal',
    initialState,
    reducers: {
        openRename: (state, action) => {
            const {payload} = action;

            state.isRenameOpen = true
            state.optAction = payload
        },
        closeRename: (state) => {
            state.isRenameOpen = false
        }
    }
})

export const {openRename, closeRename} = renameSlice.actions;
export default renameSlice.reducer;