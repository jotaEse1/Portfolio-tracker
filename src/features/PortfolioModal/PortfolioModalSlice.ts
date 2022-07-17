import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TickerError, TickerRow } from "../../types/types";

interface State {
    isOpenPM: boolean,
    isOpenIP: boolean,
    tickerRows: TickerRow[],
    tickersSend: TickerRow[],
    tickersInvalidDate: TickerError[],
    tickersNotFound: TickerError[],
    portfolioValue: number

}

const initialState: State = {
    isOpenPM: false,
    isOpenIP: false,
    tickerRows: [],
    tickersSend: [],
    tickersInvalidDate: [],
    tickersNotFound: [],
    portfolioValue: 0
}

const portfolioModalSlice = createSlice({
    name: 'portfolioModal',
    initialState,
    reducers: {
        openPM: (state) => {
            state.isOpenPM = true
        },
        closePM: (state) => {
            state.isOpenPM = false
        },
        openIP: (state) => {
            state.isOpenIP = true
        },
        closeIP: (state) => {
            state.isOpenIP = false
        },
        emptyTickerRow: (state) => {
            state.tickerRows = []
        },
        emptyTickersIncomplete: (state) => {
            state.tickersInvalidDate = []
            state.tickersNotFound = []
        },
        addTickerRow: (state, action: PayloadAction<TickerRow>) => {
            const {payload} = action;
            console.log(payload)
            state.tickerRows.push(payload)
            state.tickerRows = state.tickerRows.sort((a, b) => a.purchaseDateUnix - b.purchaseDateUnix)
        },
        setTickerRow: (state, action: PayloadAction<TickerRow[]>) => {
            const {payload} = action;
            console.log(payload)
            state.tickerRows = payload
            state.tickerRows = state.tickerRows.sort((a, b) => a.purchaseDateUnix - b.purchaseDateUnix)
        },
        updateTickerRow: (state, action: PayloadAction<TickerRow>) => {
            const {payload} = action;
            state.tickerRows = state.tickerRows.map(obj => obj.id === payload.id? payload : obj)
            state.tickerRows = state.tickerRows.sort((a, b) => a.purchaseDateUnix - b.purchaseDateUnix)
        },
        deleteTickerRow: (state, action: PayloadAction<TickerRow>) => {
            const {payload} = action;
            state.tickerRows = state.tickerRows.filter(obj => obj.id !== payload.id?  obj : null)
        },
        setPortfolioValue: (state, action) => {
            const {payload} = action
            state.portfolioValue = payload
        },
        addInvalidDate: (state, action: PayloadAction<TickerError>) => {
            state.tickersInvalidDate.push(action.payload)
        },
        addNotFound: (state, action: PayloadAction<TickerError>) => {
            state.tickersNotFound.push(action.payload)
        }


    }
})

export const {openPM, closePM, openIP, closeIP, emptyTickerRow, emptyTickersIncomplete, addTickerRow, setTickerRow, updateTickerRow, deleteTickerRow, setPortfolioValue, addInvalidDate, addNotFound} = portfolioModalSlice.actions;
export default portfolioModalSlice.reducer;