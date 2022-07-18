import { BsArrowReturnRight } from 'react-icons/bs';
import { MdOutlineUpdate } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { closePortfolios } from '../Home/HomeSlice';
import { MdCheck } from 'react-icons/md';
import { setCurrentPort, openDashboard, updatePortfolio } from '../Dashboard/DashboardSlice'
import './AllPortfolios.css'
import ModalMsg from '../ModalMsg/ModalMsg';
import IncompletePortfolio from '../IncompletePortfolio/IncompletePortfolio';
import Loader from '../Loader/Loader';
import { openPM } from '../PortfolioModal/PortfolioModalSlice';
import { AddMoney, Portfolio, ShareFlow, TickerSend, UpdatePortfolio } from '../../types/types';
import { openLoader } from '../Loader/LoaderSlice';
import { fetchDataTickers } from '../../utils/fetchTickersData';
import { closeMM, openMM, setMsg } from '../ModalMsg/ModalMsgSlice';
import { assetsConverter } from '../../utils/assetsConverter';
import { dates } from '../../utils/dates';

const AllPortfolios = () => {
    const { portfolios, today } = useAppSelector(state => state.dashboard)
    const { isOpenIP } = useAppSelector(state => state.portfolioModal)
    const { isOpenMM } = useAppSelector(state => state.modalMsg)
    const { isLoaderOpen } = useAppSelector(state => state.loader)
    const dispatch = useAppDispatch();

    const handleUpdate = async (portfolio: Portfolio) => {
        let { tickers } = portfolio,
            alreadyFetched: { [key: string]: true } = {},
            addMoney: AddMoney = {},
            allTickers: TickerSend[] = [],
            datesObj: { [key: string]: number } = {},
            capitalObj: { [key: string]: number } = {},
            { year, month, date, hour, minutes, seconds } = dates(Date.now()),
            portVal = 0;

        //open loader
        dispatch(openLoader())

        for (let i = 0; i < tickers.length; i++) {
            const { id, name, purchaseDate, purchaseDateUnix, purchasePrice, purchaseStocks, sharesFlow } = tickers[i],
                ticker = {
                    id,
                    name,
                    purchaseDate,
                    purchaseDateUnix,
                    purchasePrice,
                    purchaseStocks
                };

            portVal += Number(purchasePrice) * Number(purchaseStocks)
            portVal = Number((portVal).toFixed(2))

            try {
                const { response } = await fetchDataTickers(ticker, 0, alreadyFetched)

                alreadyFetched[response.payload.name] = true
                response.status === 200 ? allTickers.push(response.payload) : console.log('error');

                console.log(`_${response.payload.purchaseDateUnix}`)

                if (!datesObj[`_${response.payload.purchaseDateUnix}`]) datesObj[`_${response.payload.purchaseDateUnix}`] = Number((Number(response.payload.purchasePrice) * Number(response.payload.purchaseStocks)).toFixed(2))
                else datesObj[`_${response.payload.purchaseDateUnix}`] += Number((Number(response.payload.purchasePrice) * Number(response.payload.purchaseStocks)).toFixed(2))

            } catch (error) {
                dispatch(setMsg('An error ocurred. Try again later'))
                dispatch(openMM())
                setTimeout(() => dispatch(closeMM()), 3500)

                break
            }


            if (!!sharesFlow.in) {
                const keys = Object.keys(sharesFlow.in.shares)

                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j];

                    const ticker = {
                        id: Date.now().toString(30) + Math.random().toString(30),
                        name,
                        purchaseDate: sharesFlow.in.shares[key].purchaseDate,
                        purchaseDateUnix: sharesFlow.in.shares[key].purchaseDateUnix,
                        purchasePrice: sharesFlow.in.shares[key].purchasePrice,
                        purchaseStocks: sharesFlow.in.shares[key].purchaseStocks
                    };

                    portVal += Number(sharesFlow.in.shares[key].purchasePrice) * Number(sharesFlow.in.shares[key].purchaseStocks)
                    portVal = Number((portVal).toFixed(2))

                    try {
                        const { response } = await fetchDataTickers(ticker, 0, alreadyFetched)

                        if (response.status === 100) {
                            const { name, ...data } = response.payload

                            if (!addMoney[name]) {
                                addMoney[name] = { shares: {}, total: 0, totalIn: 0 } as ShareFlow

                                addMoney[name].shares[`_${data.purchaseDateUnix}`] = data
                                addMoney[name].total = Number((data.purchasePrice * data.purchaseStocks).toFixed(2))
                                addMoney[name].totalIn = Number(data.purchaseStocks)

                            } else {
                                addMoney[name].shares[`_${data.purchaseDateUnix}`] = data
                                addMoney[name].total += data.purchasePrice * data.purchaseStocks
                                addMoney[name].total = Number((addMoney[name].total).toFixed(2))
                                addMoney[name].totalIn += Number(data.purchaseStocks)
                            }

                            console.log(`_${data.purchaseDateUnix}`, !datesObj[`_${data.purchaseDateUnix}`])

                            if (!datesObj[`_${data.purchaseDateUnix}`]) datesObj[`_${data.purchaseDateUnix}`] = Number((data.purchasePrice * data.purchaseStocks).toFixed(2))
                            else datesObj[`_${data.purchaseDateUnix}`] += Number((data.purchasePrice * data.purchaseStocks).toFixed(2))
                        }
                    } catch (error) {
                        dispatch(setMsg('An error ocurred. Try again later'))
                        dispatch(openMM())
                        setTimeout(() => dispatch(closeMM()), 3500)

                        break
                    }

                }
            }
        }

        const keys = Object.keys(datesObj)
        if (keys.length) {
            let acum = 0;

            keys.sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))

            // here i create capital object to have the total in order to calculate % capital method
            for (let i = 0; i < keys.length; i++) {
                const currDate = keys[i],
                    prevDate = keys[i - 1];

                console.log(currDate, prevDate, acum)

                if (!prevDate) {
                    acum = datesObj[currDate]
                    capitalObj[currDate] = datesObj[currDate]
                } else {
                    acum += datesObj[currDate]
                    capitalObj[currDate] = acum
                }

            }
        }

        console.log('datesObj', datesObj)
        console.log('capitalObj', capitalObj)
        console.log('portVal', portVal)

        const { tickers: updatedTickers, returns, value } = assetsConverter(allTickers, addMoney, portVal, capitalObj)

        const updatePortf: UpdatePortfolio = {
            idUser: 1,
            idPortfolio: portfolio.id,
            name: portfolio.name,
            lastUpdate: `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`,
            value,
            tickers: updatedTickers,
            returns
        }

        console.log(updatePortf)
        dispatch(updatePortfolio(updatePortf))
    }

    return (
        <div className='all-portfolios-container'>
            <div className='all-portfolios-title'>
                <h1>Portfolios</h1>
            </div>
            <div className='all-portfolios-buttons'>
                <button
                    onClick={() => dispatch(openPM())}
                >
                    New Portfolio
                </button>
            </div>
            <div className='all-portfolios-list'>
                {portfolios.length ? (
                    portfolios.map(portfolio =>
                        <div
                            key={portfolio.id}
                            className='portfolio-option'
                        >
                            <div className='option-title'>
                                <h5>{portfolio.name}</h5>
                            </div>
                            <div className='option-info'>
                                <div>
                                    <p>Last Update</p>
                                    <p>{portfolio.last_update.slice(0, 10)}</p>
                                </div>
                                <div>
                                    <p>Value</p>
                                    <p>$ {portfolio.value}</p>
                                </div>
                            </div>
                            <div className='option-buttons'>
                                <button
                                    className={new Date(portfolio.last_update.slice(0, 10)).getTime() === today ? 'disabled' : 'go-button'}
                                    onClick={/*new Date(portfolio.last_update.slice(0, 10)).getTime() === today ? undefined :*/ () => handleUpdate(portfolio)}
                                >
                                    {new Date(portfolio.last_update.slice(0, 10)).getTime() === today ? (
                                        <p>
                                            Updated <MdCheck />
                                        </p>
                                    ) : (
                                        <>
                                            <p>Update</p>
                                            <MdOutlineUpdate />
                                        </>
                                    )}
                                </button>
                                <button
                                    className='go-button'
                                    onClick={() => {
                                        dispatch(setCurrentPort(portfolio))
                                        dispatch(closePortfolios())
                                        dispatch(openDashboard())
                                    }}
                                >
                                    <p>Go</p>  <BsArrowReturnRight />
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className='portfolio-empty'>
                        <h3>Create a Portfolio</h3>
                    </div>
                )}
            </div>
            {isOpenMM && <ModalMsg />}
            {isOpenIP && <IncompletePortfolio />}
            {isLoaderOpen &&
                <div className='loader-container'>
                    <Loader />
                </div>
            }
        </div>
    );
};

export default AllPortfolios;