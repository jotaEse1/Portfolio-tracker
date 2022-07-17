import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface State {
    sidebarOpen: boolean
}

const initialState: State = {
    sidebarOpen: false
}
