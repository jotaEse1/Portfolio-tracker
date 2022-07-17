import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { assetsConverter } from '../../utils/assetsConverter';
import { fetchTicker } from '../../utils/fetchTicker';
import { closeLoader, openLoader } from '../Loader/LoaderSlice';
import { setDetail, setFundamental, setTickerGraph, setTickerT } from '../Ticker/TickerSlice';
import './TickerDescription.css'

const TickerDescription = () => {
    const [form, setForm] = useState({ticker: ''})
    const {detailTicker, isTickerSet} = useAppSelector(state => state.ticker)
    const dispatch = useAppDispatch()

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value.toUpperCase()
        })
    }

    const handleSearch = () => {
        dispatch(openLoader())

        const {ticker} = form,
            today = Date.now();

        if(!ticker){
            dispatch(closeLoader())
            return //modal
        }

        fetchTicker(ticker)
            .then(array => {
                console.log(array)
                if(!array.length){
                    dispatch(closeLoader())
                    return //modal
                }

                const {0: fundamental, 1: detail} = array

                return fetch(`https://api.tdameritrade.com/v1/marketdata/${ticker}/pricehistory?apikey=ZEXA1X6AL3OSMFJYI7TECJNYSB4W3IHV&periodType=month&frequencyType=daily&endDate=${today}&startDate=0&needExtendedHoursData=false`)
                    .then(res => res.json())
                    .then(res => {
                        let { candles, empty, error } = res,
                            run = 0, minPrice = Date.now(), maxPrice = 0, minDate = Date.now(), maxDate = 0,
                            hundredCandles = [],
                            chunkCandles = []
                        

                        if (error) {
                            dispatch(closeLoader())
                            return new Error('Bad request')
                        }
                        if (empty) {
                            dispatch(closeLoader())
                            return //modal
                        }

                        for (let i = 0; i < candles.length; i++) {
                            const day = candles[i];
                            
                            if(day.low < minPrice) minPrice = day.low
                            if(day.high > maxPrice) maxPrice = day.high
                            if(day.datetime > maxDate) maxDate = day.datetime
                            if(day.datetime < minDate) minDate = day.datetime

                            if(run === 20){
                                chunkCandles.push(hundredCandles)
                                run = 0
                                hundredCandles = []
                            }else{
                                hundredCandles.push(day)
                                run += 1
                            }
                        }

                        console.log(minPrice, maxPrice, minDate, maxDate, chunkCandles)

                        dispatch(setTickerGraph({
                            minPrice,
                            maxPrice, 
                            minDate,
                            maxDate,
                            chunkCandles,
                            candles
                        }))
                        dispatch(setFundamental(fundamental))
                        dispatch(setDetail(detail))
                        dispatch(setTickerT())
                        dispatch(closeLoader())
                    })
                    .catch(err => err)


            })
            .catch(err => {
                //modal
            })

    }

    return (
        <div className='ticker-description-container'>
            <div className='ticker-search-container'>
                <input
                    type="text"
                    name='ticker'
                    value={form.ticker}
                    onChange={handleForm}
                    required
                    placeholder='Search Ticker...'
                />
                <button
                    type='button'
                    onClick={handleSearch}
                >
                    Q
                </button>
            </div>
            {isTickerSet && (
                <div className='ticker-about-container'>
                    <div>
                        <h2>{detailTicker.description}</h2>
                        <p className='Ticker'>{detailTicker.symbol}</p>
                        <p className='Asset'>{detailTicker.assetType}</p>
                    </div>
                    <p>$ 140.82</p>
                </div>
            )}

        </div>
    );
};

export default TickerDescription;