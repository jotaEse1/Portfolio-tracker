import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Detail, Fundamental, TickerAPI} from "../../types/types";

interface State {
    isTickerOpen: boolean,
    fundamentalTicker: Fundamental,
    detailTicker: Detail,
    isTickerSet: boolean,
    tickerGraph: TickerAPI[]
}

const initialState: State = {
    isTickerOpen: false,
    fundamentalTicker: {} as Fundamental,
    detailTicker: {} as Detail,
    isTickerSet: false,
    tickerGraph: []
}

const tickerSlice = createSlice({
    name: 'ticker',
    initialState,
    reducers: {
        openTicker: (state) => {state.isTickerOpen = true},
        closeTicker: (state) => {state.isTickerOpen = false},
        setFundamental: (state, action: PayloadAction<Fundamental>) => {
            const {payload} = action;
            state.fundamentalTicker = payload
        },
        setDetail: (state, action: PayloadAction<Detail>) => {
            const {payload} = action;
            state.detailTicker = payload
        },
        setTickerT: (state) => {state.isTickerSet = true},
        setTickerF: (state) => {state.isTickerSet = false},
        setTickerGraph: (state, action: PayloadAction<TickerAPI[]>) => {
            const {payload} = action
            state.tickerGraph = payload
        }

    }
})

export const {openTicker, closeTicker, setFundamental, setDetail, setTickerT, setTickerF, setTickerGraph} = tickerSlice.actions;
export default tickerSlice.reducer;