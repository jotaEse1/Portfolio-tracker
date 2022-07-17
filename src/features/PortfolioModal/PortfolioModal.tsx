import './PortfolioModal.css'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { openTI, setAdd } from '../TickerInfo/TickerInfoSlice';
import PaginationPM from '../PaginationPM/PaginationPM';
import { addInvalidDate, addNotFound, closePM, emptyTickerRow, emptyTickersIncomplete} from './PortfolioModalSlice';
import { useState } from 'react';
import { fetchDataTickers } from '../../utils/fetchTickersData';
import { PortfolioSend, TickerSend, AddMoney, ShareFlow, TickerRow, TickerError } from '../../types/types';
import { dates } from '../../utils/dates';
import { createPortfolio } from '../Dashboard/DashboardSlice';
import { assetsConverter } from '../../utils/assetsConverter';
import { closeMM, openMM, setMsg } from '../ModalMsg/ModalMsgSlice';
import { closeLoader, openLoader } from '../Loader/LoaderSlice';

const PortfolioModal = () => {
    const [form, setForm] = useState({ name: '' })
    const { tickerRows, portfolioValue} = useAppSelector(state => state.portfolioModal)
    const dispatch = useAppDispatch()

    const handleSubmit = async (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault()

        if (!form.name) {
            dispatch(setMsg('You should provide a portfolio name'))
            dispatch(openMM())
            return setTimeout(() => dispatch(closeMM()), 3500)
        }
        if (!tickerRows.length) {
            dispatch(setMsg('You should provide assets to your portfolio'))
            dispatch(openMM())
            return setTimeout(() => dispatch(closeMM()), 3500)
        }

        dispatch(openLoader())

        const allTickers: TickerSend[] = [],
            alreadyFetched: {[key: string]: true} = {},
            addMoney: AddMoney = {},
            datesObj: {[key: string]: number} = {},
            capitalObj: {[key: string]: number} = {},
            {year, month, date, hour, minutes, seconds} = dates(Date.now());

        let portVal = portfolioValue

        for (let i = 0; i < tickerRows.length; i++) {
            const ticker = tickerRows[i];
            
            try {
                const { response } = await fetchDataTickers(ticker, portfolioValue, alreadyFetched)

                if (response.status === 400) {
                    dispatch(addInvalidDate(response.payload))
                    portVal = Number((portVal - response.payload.value).toFixed(2))

                    continue
                }
                if (response.status === 300) {
                    dispatch(addNotFound(response.payload))
                    portVal = Number((portVal - response.payload.value).toFixed(2))

                    continue
                }
                if (response.status === 100){
                    const {name, ...data} = response.payload

                    if(!addMoney[name]){
                        addMoney[name] = {total: 0, totalIn: 0} as ShareFlow

                        addMoney[name][`_${data.purchaseDateUnix}`] = data
                        addMoney[name].total = Number((data.purchasePrice * data.purchaseStocks).toFixed(2))
                        addMoney[name].totalIn = Number(data.purchaseStocks)
                    }else{
                        addMoney[name][`_${data.purchaseDateUnix}`] = data
                        addMoney[name].total += data.purchasePrice * data.purchaseStocks
                        addMoney[name].total = Number((addMoney[name].total).toFixed(2))
                        addMoney[name].totalIn += Number(data.purchaseStocks)
                    }

                    if(!datesObj[`_${data.purchaseDateUnix}`]) datesObj[`_${data.purchaseDateUnix}`] = addMoney[name].total
                    else datesObj[`_${data.purchaseDateUnix}`] += addMoney[name].total

                    continue
                }
                
                alreadyFetched[response.payload.name] = true
                allTickers.push(response.payload)

                if(!datesObj[`_${response.payload.purchaseDateUnix}`]) datesObj[`_${response.payload.purchaseDateUnix}`] = Number((Number(response.payload.purchasePrice) * Number(response.payload.purchaseStocks)).toFixed(2))
                else datesObj[`_${response.payload.purchaseDateUnix}`] += Number((Number(response.payload.purchasePrice) * Number(response.payload.purchaseStocks)).toFixed(2))

            } catch (error) {
                dispatch(setMsg('An error ocurred. Try again later'))
                dispatch(openMM())
                setTimeout(() => dispatch(closeMM()), 3500)

                break
            }
        }

        if(!allTickers.length){
            dispatch(closeLoader())
            dispatch(setMsg('You should provide assets to your portfolio'))
            dispatch(emptyTickersIncomplete())
            dispatch(openMM())
            return setTimeout(() => dispatch(closeMM()), 3500)
        }

        const keys = Object.keys(datesObj)
        if(keys.length){
            let acum = 0;

            keys.sort((a, b) => Number(a.slice(1))  - Number(b.slice(1)))

            // here i create capital object to have the total in order to calculate % capital method
            for (let i = 0; i < keys.length; i++) {
                const currDate = keys[i],
                    prevDate = keys[i - 1];
                
                console.log(currDate, prevDate, acum)

                if(!prevDate){
                    acum = datesObj[currDate]
                    capitalObj[currDate] = datesObj[currDate]
                }else{
                    acum += datesObj[currDate]
                    capitalObj[currDate] = acum 
                }

            }
        }

        console.log('allTickers', allTickers)
        console.log('alreadyFetched', alreadyFetched)
        console.log('addMoney', addMoney)
        console.log('capitalObj', capitalObj)

        const {tickers, returns, value} = assetsConverter(allTickers, addMoney, portVal, capitalObj)

        const portfolio: PortfolioSend = {
            idUser: 1,
            name: form.name.trim(),
            lastUpdate: `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`,
            value,
            tickers,
            returns
        }

        console.log(portfolio)
        dispatch(createPortfolio(portfolio))
        dispatch(closePM())
    }

    return (
        <div className='portfolio-modal'>
            <div className='portfolio-container'>
                <h5 className='choose-title'>New Portfolio</h5>
                <form className='portfolio-details'>
                    <div className='portfolio-details_name'>
                        <label htmlFor="portfolioName">Portfolio Name: </label>
                        <input
                            type="text"
                            placeholder='some name...'
                            required
                            value={form.name}
                            onChange={e => setForm({ name: e.target.value })}
                        />
                    </div>
                    <div className='portfolio-details_tickers'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Price</th>
                                    <th>Date</th>
                                    <th>Stocks</th>
                                    <th>Allocation</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickerRows.length ? (
                                    <PaginationPM
                                        tickers={tickerRows}
                                    />
                                ) : (
                                    <>
                                        <tr className='empty'>
                                            <td colSpan={6} style={{ textAlign: 'center' }}>Add Stocks to your portfolio!</td>
                                        </tr>
                                        <tr className='add-ticker'>
                                            <td colSpan={6}>
                                                <button
                                                    onClick={() => {
                                                        dispatch(openTI())
                                                        dispatch(setAdd())
                                                    }}
                                                    type='button'
                                                >
                                                    Add Ticker
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </form>
                <div className='portfolio-buttons'>
                    <button
                        type='button'
                        name='delete'
                        onClick={() => {
                            dispatch(closePM())
                            dispatch(emptyTickerRow())
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSubmit}
                    >
                        Create
                    </button>
                </div>
            </div >
        </div >
    );
};

export default PortfolioModal;
