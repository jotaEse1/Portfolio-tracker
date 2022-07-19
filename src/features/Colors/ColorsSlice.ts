import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    isColorsOpen: false,
    color: {name: 'green', hex: '#39FF14', back: '#121212'},
    colors: [
        {name: 'blue', hex: '#00ECFF', back: '#121212'}, 
        {name: 'rose', hex: '#FF55A2', back: '#121212'}, 
        {name: 'red', hex: '#FF0000', back: '#121212'}, 
        {name: 'yellow', hex: '#FEED26', back: '#121212'}, 
        {name: 'green', hex: '#39FF14', back: '#121212'},
        {name: 'black', hex: '#000117', back: 'white'},
        {name: 'violet', hex: '#3330E4', back: 'white'}
    ]
}

const colorsSlice = createSlice({
    name: 'colors',
    initialState,
    reducers: {
        openColors: (state) => {
            state.isColorsOpen = true
        },
        closeColors: (state) => {
            state.isColorsOpen = false
        },
        setColor: (state, action: PayloadAction<{name: string, hex: string, back: string}>) => {
            const {payload} = action;

            state.color = payload
        }
    }
})

export const {openColors, closeColors, setColor} = colorsSlice.actions;
export default colorsSlice.reducer;