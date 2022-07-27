import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { URLS } from "../../enums/enums";
import { closeLoader } from "../Loader/LoaderSlice";
import { closeMM, openMM, setMsg } from "../ModalMsg/ModalMsgSlice";

const initialState = {
    isAuthenticated: false,
    isLoginOpen: false,
    user: ''
}

export const signIn = createAsyncThunk('authentication/signIn',
    async (credentials: { username: string, email: string, password: string }, thunkAPI) => {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(credentials)
        };

        try {
            const req = await fetch(URLS.SIGNIN, options)
            const response = await req.json()

            console.log(response)
            if (!response.success) {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg('An error ocurred. Try again later.'))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
            } else {
                if (response.payload.status === 500) {
                    thunkAPI.dispatch(closeLoader())
                    thunkAPI.dispatch(setMsg(response.payload.errors[0].msg))
                    thunkAPI.dispatch(openMM())
                    setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                }
                if (response.payload.status === 300) {
                    thunkAPI.dispatch(closeLoader())
                    thunkAPI.dispatch(setMsg(response.payload.msg))
                    thunkAPI.dispatch(openMM())
                    setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                }
                if (response.payload.status === 201) {
                    thunkAPI.dispatch(closeLoader())
                    thunkAPI.dispatch(setMsg(`Welcome ${credentials.username}!`))
                    thunkAPI.dispatch(openMM())
                    setTimeout(() => {
                        thunkAPI.dispatch(closeMM())
                        thunkAPI.dispatch(setUser(response.payload.createdUser.insertId))
                        thunkAPI.dispatch(authenticateUser())
                    }, 3500)

                }

            }
        } catch (error) {
            thunkAPI.dispatch(closeLoader())
            thunkAPI.dispatch(setMsg('An error ocurred. Try again later.'))
            thunkAPI.dispatch(openMM())
            setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
        }
    }
)

export const logIn = createAsyncThunk('authentication/logIn',
    async (credentials: { email: string, password: string }, thunkAPI) => {
        const options: RequestInit = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(credentials)
        };

        try {
            const req = await fetch(URLS.LOGIN, options)
            const response = await req.json()

            console.log(response)
            if (!response.success) {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg('An error ocurred. Try again later.'))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
            } else {
                if (response.payload.status === 500) {
                    thunkAPI.dispatch(closeLoader())
                    thunkAPI.dispatch(setMsg(response.payload.errors[0].msg))
                    thunkAPI.dispatch(openMM())
                    setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                }
                if (response.payload.status === 404) {
                    thunkAPI.dispatch(closeLoader())
                    thunkAPI.dispatch(setMsg(response.payload.msg))
                    thunkAPI.dispatch(openMM())
                    setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
                }
                if (response.payload.status === 200) {
                    thunkAPI.dispatch(closeLoader())
                    thunkAPI.dispatch(setMsg(`Welcome back ${response.payload.username}`))
                    thunkAPI.dispatch(openMM())
                    setTimeout(() => {
                        thunkAPI.dispatch(closeMM())
                        thunkAPI.dispatch(setUser(response.payload.id))
                        thunkAPI.dispatch(authenticateUser())
                    }, 3500)

                }

            }
        } catch (error) {
            thunkAPI.dispatch(closeLoader())
            thunkAPI.dispatch(setMsg('An error ocurred. Try again later.'))
            thunkAPI.dispatch(openMM())
            setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
        }
    }
)

export const logOut = createAsyncThunk('authentication/logOut',
    async (_, thunkAPI) => {
        const options: RequestInit = {
            method: 'POST',
            credentials: 'include'
        };

        try {
            const req = await fetch(URLS.LOGOUT, options)
            const response = await req.json()

            console.log(response)
            if (!response.success) {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg('An error ocurred. Try again later.'))
                thunkAPI.dispatch(openMM())
                setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
            } else {
                thunkAPI.dispatch(closeLoader())
                thunkAPI.dispatch(setMsg(response.payload.msg))
                thunkAPI.dispatch(openMM())
                thunkAPI.dispatch(setUser(''))
                thunkAPI.dispatch(denyAccess())
                setTimeout(() => {
                    thunkAPI.dispatch(closeMM())
                }, 3500)
            }
        } catch (error) {
            thunkAPI.dispatch(closeLoader())
            thunkAPI.dispatch(setMsg('An error ocurred. Try again later.'))
            thunkAPI.dispatch(openMM())
            setTimeout(() => thunkAPI.dispatch(closeMM()), 3500)
        }
    }
)

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        openLogIn: (state) => { state.isLoginOpen = true },
        openSignIn: (state) => { state.isLoginOpen = false },
        authenticateUser: (state) => { state.isAuthenticated = true },
        denyAccess: (state) => { state.isAuthenticated = false },
        setUser: (state, action: PayloadAction<string>) => {
            const { payload } = action
            state.user = payload

        }
    }
})

export const { openLogIn, openSignIn, authenticateUser, denyAccess, setUser } = authenticationSlice.actions;
export default authenticationSlice.reducer;