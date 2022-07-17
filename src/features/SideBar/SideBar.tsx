import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import './SideBar.css'
import { closeBar, closeHoldings, closePortfolio, openBar, openHoldings, openPortfolio } from './SideBarSlice';
import { CgMenuGridO } from 'react-icons/cg'
import { setTickerRow } from '../PortfolioModal/PortfolioModalSlice';
import { closeDashboard } from '../Dashboard/DashboardSlice';
import { openHome, openPortfolios } from '../Home/HomeSlice';
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai'
import { BsArrowReturnRight } from 'react-icons/bs';
import { openRename } from '../RenameModal/RenameModalSlice';
import { closeLoader, openLoader } from '../Loader/LoaderSlice';
import { TickerRow } from '../../types/types';
import { openHM } from '../HoldingsModal/HoldingsModalSlice';
import { openTransactions } from '../Transactions/TransactionsSlice';

const SideBar = () => {
    const { sidebarOpen, optionsPortfolioOpen, optionsHoldingsOpen } = useAppSelector(state => state.sideBar)
    const { currentPortfolio } = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch()

    const handleAddHoldings = (ui: string) => {
        dispatch(closeBar())
        dispatch(openLoader())

        const tickersArr: TickerRow[] = [],
            tickersOut: TickerRow[] = [];

        setTimeout(() => {

            for (let i = 0; i < currentPortfolio.tickers.length; i++) {
                const { id, name, purchaseDate, purchaseDateUnix, purchasePrice, purchaseStocks, sharesFlow } = currentPortfolio.tickers[i];

                if (!!sharesFlow.in) {
                    const keys = Object.keys(sharesFlow.in)

                    for (let j = 0; j < keys.length; j++) {
                        const key = keys[j];

                        if (key === 'total' || key === 'totalIn') continue

                        console.log(key)
                        tickersArr.push({
                            id: Date.now().toString(30) + Math.random().toString(30),
                            name,
                            purchaseDate: sharesFlow.in[key].purchaseDate,
                            purchaseDateUnix: sharesFlow.in[key].purchaseDateUnix,
                            purchasePrice: sharesFlow.in[key].purchasePrice,
                            purchaseStocks: sharesFlow.in[key].purchaseStocks
                        })

                    }
                }
                if (!!sharesFlow.out) {
                    const keys = Object.keys(sharesFlow.out)

                    for (let j = 0; j < keys.length; j++) {
                        const key = keys[j];

                        if (key === 'total' || key === 'totalOut') continue

                        if (ui === 'sell') {
                            tickersOut.push({
                                id: Date.now().toString(30) + Math.random().toString(30),
                                name,
                                purchaseDate: sharesFlow.out[key].purchaseDate,
                                purchaseDateUnix: sharesFlow.out[key].purchaseDateUnix,
                                purchasePrice: sharesFlow.out[key].purchasePrice,
                                purchaseStocks: sharesFlow.out[key].purchaseStocks
                            })
                        } else {
                            tickersArr.push({
                                id: Date.now().toString(30) + Math.random().toString(30),
                                name,
                                purchaseDate: sharesFlow.out[key].purchaseDate,
                                purchaseDateUnix: sharesFlow.out[key].purchaseDateUnix,
                                purchasePrice: sharesFlow.out[key].purchasePrice,
                                purchaseStocks: sharesFlow.out[key].purchaseStocks
                            })
                        }


                    }
                }

                tickersArr.push({ id, name, purchaseDate, purchaseDateUnix, purchasePrice, purchaseStocks })
            }

            dispatch(setTickerRow(tickersArr))

            dispatch(closeLoader())
            dispatch(openHM(ui))

        }, 1000);


    }

    return (
        <>
            {!sidebarOpen ? (
                <div className='sidebar-door-closed'
                    onClick={() => dispatch(openBar())}
                >
                    <CgMenuGridO />
                </div>
            ) : (
                <div className='sidebar-modal'>
                    <div className='sidebar-container'>
                        <div className='sidebar-content'>
                            <h4>{currentPortfolio.name}</h4>
                            <div className='sidebar-portfolio-options'>
                                <h3>Portfolio</h3>
                                {!optionsPortfolioOpen ? (
                                    <button
                                        onClick={() => dispatch(openPortfolio())}
                                        className='view-button'
                                        title='Mostrar receta'
                                        role='open'
                                    ><AiOutlineDown /></button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => dispatch(closePortfolio())}
                                            className='view-button'
                                            title='Mostrar receta'
                                            role='open'
                                        ><AiOutlineUp /></button>
                                        <div className='options-container'>
                                            <button
                                                onClick={() => {
                                                    dispatch(closeBar())
                                                    dispatch(openRename('rename'))
                                                }}
                                            >
                                                Rename Portfolio
                                            </button>
                                            <button
                                                onClick={() => {
                                                    dispatch(closeBar())
                                                    dispatch(openRename('delete'))
                                                }}
                                            >
                                                Delete Portfolio
                                            </button>
                                            <button
                                                onClick={() => {
                                                    dispatch(closeBar())
                                                    dispatch(closeDashboard())
                                                    dispatch(openTransactions())
                                                }}
                                            >
                                                Transactions
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='sidebar-portfolio-options'>
                                <h3>Holdings</h3>
                                {!optionsHoldingsOpen ? (
                                    <button
                                        onClick={() => dispatch(openHoldings())}
                                        className='view-button'
                                        title='Mostrar receta'
                                        role='open'
                                    ><AiOutlineDown /></button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => dispatch(closeHoldings())}
                                            className='view-button'
                                            title='Mostrar receta'
                                            role='open'
                                        ><AiOutlineUp /></button>
                                        <div className='options-container'>
                                            <button
                                                onClick={() => handleAddHoldings('add')}
                                            >
                                                Add Holdings
                                            </button>
                                            <button
                                                onClick={() => handleAddHoldings('edit')}
                                            >
                                                Edit Holdings
                                            </button>
                                            <button
                                                onClick={() => handleAddHoldings('delete')}
                                            >
                                                Delete Holdings
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='sidebar-content-menu'>
                            <h4>Menu</h4>
                            <div
                                className='sidebar-portfolio-options'
                                onClick={() => {
                                    dispatch(openHome())
                                    dispatch(closeDashboard())
                                    dispatch(closeBar())
                                }}
                            >
                                Home
                                <button className='view-button'>
                                    <BsArrowReturnRight />
                                </button>
                            </div>
                            <div
                                className='sidebar-portfolio-options'
                                onClick={() => {
                                    dispatch(openPortfolios())
                                    dispatch(closeDashboard())
                                    dispatch(closeBar())
                                }}
                            >
                                Portfolios
                                <button className='view-button'>
                                    <BsArrowReturnRight />
                                </button>
                            </div>
                            <div className='sidebar-portfolio-options'>
                                Tickers
                                <button className='view-button'>
                                    <BsArrowReturnRight />
                                </button>
                            </div>
                            <div className='sidebar-portfolio-options'>
                                Screener
                                <button className='view-button'>
                                    <BsArrowReturnRight />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='sidebar-door-opened'
                        onClick={() => dispatch(closeBar())}
                    >
                        <CgMenuGridO />
                    </div>
                </div>
            )}
        </>
    );
};

export default SideBar;