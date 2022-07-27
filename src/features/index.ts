import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./Dashboard/DashboardSlice";
import counterReducer from './Counter/counterSlice'
import sideBarReducer from './SideBar/SideBarSlice'
import PortfolioModalReducer from "./PortfolioModal/PortfolioModalSlice";
import TickerInfoReducer from "./TickerInfo/TickerInfoSlice";
import PaginationPMReducer from "./PaginationPM/PaginationPMSlice";
import PMRowReducer from "./PMRow/PMRowSlice";
import modalMsgReducer from "./ModalMsg/ModalMsgSlice"
import LoaderReducer from "./Loader/LoaderSlice";
import HomeReducer from "./Home/HomeSlice";
import ColorsReducer from "./Colors/ColorsSlice";
import ChartReducer from "./Chart/ChartSlice";
import RenameModalReducer from "./RenameModal/RenameModalSlice";
import HoldingsReducer from "./HoldingsModal/HoldingsModalSlice";
import TransactionsReducer from "./Transactions/TransactionsSlice";
import PanelReducer from "./Panel/PanelSlice";
import TickerReducer from "./Ticker/TickerSlice";
import AuthenticationReducer from "./Authentication/AuthenticationSlice";
import NavbarReducer from "./Navbar/NavbarSlice";

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        authentication: AuthenticationReducer,
        ticker: TickerReducer,
        home: HomeReducer,
        portfolioModal: PortfolioModalReducer,
        sideBar: sideBarReducer,
        paginationPM: PaginationPMReducer,
        tickerInforamtion: TickerInfoReducer,
        rowPM: PMRowReducer,
        modalMsg: modalMsgReducer,
        chart: ChartReducer,
        renameModal: RenameModalReducer,
        holdingsModal: HoldingsReducer,
        loader: LoaderReducer,
        transactions: TransactionsReducer,
        panel: PanelReducer,
        colors: ColorsReducer,
        navbar: NavbarReducer,
        counter: counterReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch