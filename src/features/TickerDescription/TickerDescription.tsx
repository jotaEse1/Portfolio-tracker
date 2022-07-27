import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { assetsConverter } from '../../utils/assetsConverter';
import { fetchTicker } from '../../utils/fetchTicker';
import { closeLoader, openLoader } from '../Loader/LoaderSlice';
import { setDetail, setFundamental, setTickerGraph, setTickerT } from '../Ticker/TickerSlice';
import { CgSearch } from 'react-icons/cg';
import './TickerDescription.css'
import { closeMM, openMM, setMsg } from '../ModalMsg/ModalMsgSlice';

const TickerDescription = () => {
    const [form, setForm] = useState({ ticker: '' })
    const { detailTicker, isTickerSet } = useAppSelector(state => state.ticker)
    const dispatch = useAppDispatch()

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value.toUpperCase()
        })
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(openLoader())

        const { ticker } = form,
            today = Date.now();

        if (!ticker) {
            dispatch(closeLoader())
            dispatch(setMsg('You should provide a ticker'))
            dispatch(openMM())
            setTimeout(() => dispatch(closeMM()), 3500)
            return
        }

        fetchTicker(ticker)
            .then(array => {
                if (!array.length) {
                    dispatch(closeLoader())
                    dispatch(setMsg(`Ticker "${ticker}" not found`))
                    dispatch(openMM())
                    setTimeout(() => dispatch(closeMM()), 3500)
                    return
                }

                const { 0: fundamental, 1: detail } = array

                return fetch(`https://${process.env.REACT_APP_API_PROVIDER}/v1/marketdata/${ticker}/pricehistory?apikey=${process.env.REACT_APP_API_KEY}&periodType=year&frequencyType=monthly&endDate=${today}&startDate=0&needExtendedHoursData=false`)
                    .then(res => res.json())
                    .then(res => {
                        let { candles, empty, error } = res;

                        if (error) {
                            dispatch(closeLoader())
                            dispatch(setMsg('An error ocurred. Try again later'))
                            dispatch(openMM())
                            setTimeout(() => dispatch(closeMM()), 3500)
                            return
                        }
                        if (empty) {
                            dispatch(closeLoader())
                            dispatch(setMsg(`Ticker "${ticker}" not found`))
                            dispatch(openMM())
                            setTimeout(() => dispatch(closeMM()), 3500)
                            return
                        }

                        dispatch(setTickerGraph(candles))
                        dispatch(setFundamental(fundamental))
                        dispatch(setDetail({ ...detail, price: candles.at(-1).close }))
                        dispatch(setTickerT())
                        dispatch(closeLoader())
                    })
                    .catch(err => {
                        dispatch(closeLoader())
                        dispatch(setMsg('An error ocurred. Try again later.'))
                        dispatch(openMM())
                        setTimeout(() => dispatch(closeMM()), 3500)
                    })
            })
            .catch(err => {
                dispatch(closeLoader())
                dispatch(setMsg('An error ocurred. Try again later.'))
                dispatch(openMM())
                setTimeout(() => dispatch(closeMM()), 3500)
            })

    }

    return (
        <div className='ticker-description-container'>
            <form
                className='ticker-search-container'
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    name='ticker'
                    value={form.ticker}
                    onChange={handleForm}
                    required
                    placeholder='Search Ticker...'
                />
                <button>
                    <CgSearch />
                </button>
            </form>
            {isTickerSet && (
                <div className='ticker-about-container'>
                    <div>
                        <h2>{detailTicker.description}</h2>
                        <p className='Ticker'>{detailTicker.symbol}</p>
                        <p className='Asset'>{detailTicker.assetType}</p>
                    </div>
                    <p>$ {detailTicker.price}</p>
                </div>
            )}

        </div>
    );
};

export default TickerDescription;