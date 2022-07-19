import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isColorsOpen: false,
    color: {name: 'green', hex: '#39FF14'},
    colors: [
        {name: 'blue', hex: '#00ECFF', back: 'black'}, 
        {name: 'rose', hex: '#FF55A2', back: 'black'}, 
        {name: 'red', hex: '#FF0000', back: 'black'}, 
        {name: 'yellow', hex: '#FEED26', back: 'black'}, 
        {name: 'green', hex: '#39FF14', back: 'black'},
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
        setColor: (state, action) => {
            const {payload} = action;

            state.color = payload
        }
    }
})

export const {openColors, closeColors, setColor} = colorsSlice.actions;
export default colorsSlice.reducer;