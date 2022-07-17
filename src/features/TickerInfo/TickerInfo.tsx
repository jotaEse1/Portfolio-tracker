import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { IoMdClose } from 'react-icons/io'
import './TickerInfo.css'
import { addTickerRow, updateTickerRow } from '../PortfolioModal/PortfolioModalSlice';
import { closeTI } from './TickerInfoSlice';
import { useState } from 'react';
import { setPMRow } from '../PMRow/PMRowSlice';

const initialForm = {
    name: '',
    purchaseDate: '',
    purchasePrice: 0,
    purchaseStocks: 0
}

const TickerInfo = () => {
    const {operation} = useAppSelector(state => state.tickerInforamtion)
    const {rowPM} = useAppSelector(state => state.rowPM)
    const [form, setForm] = useState(rowPM)
    const dispatch = useAppDispatch();

    const handleForm = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form, 
            [evt.target.name]: evt.target.value
        })
    }

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const {name, purchaseDate, purchasePrice, purchaseStocks} = form

        if(!name || !purchaseDate || !purchasePrice || !purchaseStocks) return //modal
        if(isNaN(new Date(purchaseDate).getTime())) return //modal

        if(operation === 'Add'){
            dispatch(addTickerRow({
                ...form, 
                name: name.trim().toLocaleUpperCase(),
                purchaseDateUnix: new Date(`${purchaseDate} 02:00:00`).getTime(),
                purchaseDate: `${purchaseDate} 02:00:00`,
                id: Date.now().toString(30) + Math.random().toString(30)
            }))
            dispatch(setPMRow(initialForm))
            return dispatch(closeTI())
        }

        dispatch(updateTickerRow({
            ...form, 
            name: name.trim().toLocaleUpperCase(),
            purchaseDateUnix: new Date(`${purchaseDate} 02:00:00`).getTime(),
            purchaseDate: `${purchaseDate} 02:00:00`,
            id: rowPM.id
        }))
        dispatch(setPMRow(initialForm))
        return dispatch(closeTI())
    }

    return (
        <div className='tickerInfo-modal'>
            <form className='tickerInfo-container' onSubmit={handleSubmit}>
                <h3>{operation === 'Add'? 'Add' : 'Modify'} Ticker</h3>
                <div>
                    <label htmlFor="tickerName">Ticker</label>
                    <input 
                        type="text" 
                        placeholder='e.g. AAPL'
                        onChange={handleForm}
                        name='name'
                        value={form.name}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date">Date purchased</label>
                    <input 
                        type="date" 
                        onChange={handleForm}
                        name='purchaseDate'
                        value={form.purchaseDate}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Entry Price</label>
                    <input 
                        type="number" 
                        min='0'
                        step='.01'
                        placeholder='e.g. 152.20'
                        onChange={handleForm}
                        name='purchasePrice'
                        value={form.purchasePrice? form.purchasePrice : ''}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="stocks">Number of Stocks</label>
                    <input 
                        type="number" 
                        min='1'
                        step='1'
                        placeholder='e.g. 10'
                        onChange={handleForm}
                        name='purchaseStocks'
                        value={form.purchaseStocks? form.purchaseStocks : ''}
                        required
                    />
                </div>
                <button
                    type='button'
                    id='close'
                    onClick={() => dispatch(closeTI())}
                >
                    <IoMdClose />
                </button>
                <button type='submit'>
                    Add
                </button>
            </form>
        </div>
    );
};

export default TickerInfo;