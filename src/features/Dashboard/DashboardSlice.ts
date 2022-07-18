import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { URLS } from "../../enums/enums";
import { HoldingsSend, Portfolio, PortfolioRecived, PortfolioSend, UpdatePortfolio } from "../../types/types";
import { assetsConverter } from "../../utils/assetsConverter";
import { dates } from "../../utils/dates";
import { closeLoader } from "../Loader/LoaderSlice";
import { closeMM, openMM, setMsg } from "../ModalMsg/ModalMsgSlice";
import { openIP } from "../PortfolioModal/PortfolioModalSlice";

interface State {
    isDashboardOpen: boolean,
    portfolios: Portfolio[],
    currentPortfolio: Portfolio,
    today: number
}

const { year, month, date } = dates(Date.now())

const initialState: State = {
    isDashboardOpen: false,
    portfolios: [],
    currentPortfolio: {} as Portfolio,
    today: new Date(`${year}-${month}-${date}`).getTime()
}

export const getPortfolios = createAsyncThunk('dashboard/getPortfolios',
    async (id: string, thunkAPI) => {
        try {
            const req = await fetch(`${URLS.PORTFOLIO}?idUser=${id}`)
            const response = await req.json()

            if (!response.success) {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
            } else {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                return response.payload.data
            }
        } catch (error) {
            thunkAPI.dispatch(closeLoader())
            thunkAPI.dispatch(setMsg('An error ocurred. Try again later.'))
            thunkAPI.dispatch(openMM())
            return setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
        }
    }
)

export const createPortfolio = createAsyncThunk('dashboard/createPortfolios',
    async (portfolio: PortfolioSend, {getState, dispatch, rejectWithValue}) => {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(portfolio)
        };

        try {
            const req = await fetch(URLS.PORTFOLIO, options),
                response = await req.json(),
                {portfolioModal} = getState() as {portfolioModal: any},
                { tickersInvalidDate, tickersNotFound } = portfolioModal;

            if (tickersInvalidDate.length || tickersNotFound.length) {
                setTimeout(() => {
                    dispatch(openIP())
                }, 2000);
            }
            if (!response.success) {
                dispatch(closeLoader())
                dispatch(setMsg(response.payload.msg))
                dispatch(openMM())
                setTimeout(() => dispatch(closeMM()), 3500)
            } else {
                dispatch(closeLoader())
                dispatch(setMsg(response.payload.msg))
                dispatch(openMM())
                setTimeout(() => dispatch(closeMM()), 3500)
                return response.payload.data
            }
        } catch (error) {
            console.log(error)
            return rejectWithValue(`An error ocurred while trying to create ${portfolio.name} portfolio`);
        }
    }
)

export const renamePortfolio = createAsyncThunk('dashboard/renamePortfolios',
    async (data: { id: number, name: string }, thunkAPI) => {
        const options: RequestInit = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        try {
            const req = await fetch(URLS.PORTFOLIO, options),
                response = await req.json();

            if (!response.success) {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
            } else {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                return response.payload.data
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(`An error ocurred while trying to rename ${data.name} portfolio`);
        }
    }
)

export const deletePortfolio = createAsyncThunk('dashboard/deletePortfolios',
    async (obj: { id: number }, thunkAPI) => {
        const options: RequestInit = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        };

        try {
            const req = await fetch(URLS.PORTFOLIO, options),
                response = await req.json();

            if (!response.success) {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
            } else {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                return response.payload.data
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(`An error ocurred while trying to delete portfolio`);
        }

    }
)

export const updatePortfolio = createAsyncThunk('dashboard/updatePortfolio',
    async (portfolio: UpdatePortfolio, thunkAPI) => {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(portfolio)
        };

        try {
            const req = await fetch(URLS.UPDATEPORTFOLIO, options),
                response = await req.json();

            if (!response.success) {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
            } else {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                return response.payload.data
            }
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue(`An error ocurred while trying to update ${portfolio.name} portfolio`);
        }
    }
)

export const holdingActions = createAsyncThunk('dashboard/holdingActions',
    async (portfolio: HoldingsSend, {getState, dispatch, rejectWithValue}) => {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(portfolio)
        };

        try {
            const req = await fetch(URLS.HOLDINGS, options),
                response = await req.json(),
                {portfolioModal} = getState() as {portfolioModal: any},
                { tickersInvalidDate, tickersNotFound } = portfolioModal;

            if (tickersInvalidDate.length || tickersNotFound.length) {
                setTimeout(() => {
                    dispatch(openIP())
                }, 2000);
            }
            if (!response.success) {
                dispatch(closeLoader())
                dispatch(setMsg(response.payload.msg))
                dispatch(openMM())
                setTimeout(() => dispatch(closeMM()), 3500)
            } else {
                dispatch(closeLoader())
                dispatch(setMsg(response.payload.msg))
                dispatch(openMM())
                setTimeout(() => dispatch(closeMM()), 3500)
                return response.payload.data
            }
        } catch (error) {
            console.log(error)
            return rejectWithValue(`An error ocurred while trying to ${portfolio.ui} holdings`);
        }
    }
)

const dashBoardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        openDashboard: (state) => {
            state.isDashboardOpen = true
        },
        closeDashboard: (state) => {
            state.isDashboardOpen = false
        },
        setCurrentPort: (state, action: PayloadAction<Portfolio>) => {
            const { payload } = action;

            state.currentPortfolio = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPortfolios.fulfilled, (state, action) => {
            const { payload } = action

            if (!payload.portfolios) return

            console.log(payload.portfolios)

            payload.portfolios.forEach((obj: PortfolioRecived) => {
                obj.returns = JSON.parse(obj.returns)
                obj.tickers = JSON.parse(obj.tickers)
            });

            state.portfolios = payload.portfolios
        })
        builder.addCase(createPortfolio.fulfilled, (state, action) => {
            console.log(action);
            const { payload } = action

            if(!payload) return

            payload.portfolios.forEach((obj: PortfolioRecived) => {
                obj.returns = JSON.parse(obj.returns)
                obj.tickers = JSON.parse(obj.tickers)
            });

            state.portfolios = payload.portfolios
        })
        builder.addCase(renamePortfolio.fulfilled, (state, action) => {
            const { payload } = action;

            payload.portfolios.forEach((obj: PortfolioRecived) => {
                obj.returns = JSON.parse(obj.returns)
                obj.tickers = JSON.parse(obj.tickers)
            });

            state.currentPortfolio.name = payload.name
            state.portfolios = payload.portfolios
        })
        builder.addCase(deletePortfolio.fulfilled, (state, action) => {
            const { payload } = action;

            payload.portfolios.forEach((obj: PortfolioRecived) => {
                obj.returns = JSON.parse(obj.returns)
                obj.tickers = JSON.parse(obj.tickers)
            });

            state.currentPortfolio.name = payload.name
            state.portfolios = payload.portfolios
        })
        builder.addCase(holdingActions.fulfilled, (state, action) => {
            let { payload } = action,
                current: Portfolio = {} as Portfolio;

            payload.portfolios.forEach((obj: PortfolioRecived) => {
                obj.returns = JSON.parse(obj.returns)
                obj.tickers = JSON.parse(obj.tickers)

                if (obj.id === payload.idPortfolio) current = obj as unknown as Portfolio
            });

            state.currentPortfolio = current
            state.portfolios = payload.portfolios
        })
        builder.addCase(updatePortfolio.fulfilled, (state, action) => {
            let { payload } = action

            payload.portfolios.forEach((obj: PortfolioRecived) => {
                obj.returns = JSON.parse(obj.returns)
                obj.tickers = JSON.parse(obj.tickers)
            });

            state.portfolios = payload.portfolios
        })
    }
})

export const { openDashboard, closeDashboard, setCurrentPort } = dashBoardSlice.actions;
export default dashBoardSlice.reducer;