import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dates } from "../../utils/dates";

interface State {
    time: {
        period: string;
        num: number;
    }[];
    chartTipe: {
        title: string;
        key: 'total' | 'percentage' | 'total_%' | 'capital' | 'tree';
    }[];
    currentTime: {
        period: string;
        num: number;
    };
    currentChartTipe: {
        title: string;
        key: 'total' | 'percentage' | 'total_%' | 'capital' | 'tree';
    };
}

const today =  Date.now(),
    {year} = dates(today),
    ytd = new Date(`${year - 1}-12-31 02:00:00`).getTime(),
    days = Number(((today - ytd) / 86400000).toFixed(0)),
    daysOff = ( Number((days/7).toFixed(0)) ) * 2,
    diff = days - daysOff;

const initialState: State = {
    time: [
        {period: '1W', num: 7 - (1 * 2)},
        {period: '2W', num: 14 - (2 * 2)},
        {period: '1M', num: 30 - (5 * 2)},
        {period: '3M', num: 90 - (13 * 2)},
        {period: '6M', num: 180 - (26 * 2)},
        {period: 'YTD', num: diff},
        {period: '1Y', num: 360 - (53 * 2)},
        {period: '2Y', num: 720 - (105 * 2)},
        {period: 'Max', num: 100000000},
    ],
    chartTipe: [
        {title: 'Market Value', key: 'total'},
        {title: 'Total Return', key: 'percentage'},
        {title: 'Daily Returns', key: 'total_%'},
        {title: 'Capital Value', key: 'capital'},
        {title: 'Tree Map', key: 'tree'}
    ],
    currentTime: {period: '1M', num: 30 - (5 * 2)},
    currentChartTipe: {title: 'Unit Method', key: 'percentage'}
}

const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {
        setCurrentTime: (state, action: PayloadAction<{period: string, num: number}>) => {
            const {payload} = action;
            state.currentTime = payload
        },
        setCurrentGraph: (state, action: PayloadAction<{title: string, key: 'total' | 'percentage' | 'total_%' | 'capital' | 'tree'}>) => {
            const {payload} = action;
            state.currentChartTipe = payload
        }
    }
})

export const { setCurrentTime, setCurrentGraph } = chartSlice.actions;
export default chartSlice.reducer;
