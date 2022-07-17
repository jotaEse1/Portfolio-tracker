import { IoMdClose } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { closeIP, emptyTickersIncomplete } from '../PortfolioModal/PortfolioModalSlice';
import './IncompletePortfolio.css'

const IncompletePortfolio = () => {
    const { tickersInvalidDate, tickersNotFound } = useAppSelector(state => state.portfolioModal)
    const dispatch = useAppDispatch()

    return (
        <div className='incomplete-modal'>
            <div className='incomplete-container'>
                <div className='incomplete-title'>
                    <h3>Warning</h3>
                    <p>Portfolio was created, but we had some problems with some tickers
                        and we couldn't incluide them in the portfolio. Please check these issues and
                        add these tickers to the portfolio with correct description in the "Add Holdings" button
                    </p>
                </div>
                <div className='incomplete-tables'>
                        {tickersInvalidDate.length ? (
                            <div className='tables-invalid-date'>
                                <h3>Tickers with Invalid Dates</h3>
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Ticker</th>
                                                <th>Price</th>
                                                <th>Date</th>
                                                <th>Stocks</th>
                                                <th>Allocation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickersInvalidDate.map((obj, i) => 
                                                <tr className='row' key={i}>
                                                    <td>{obj.name}</td>
                                                    <td>$ {obj.purchasePrice}</td>
                                                    <td>{obj.purchaseDate.slice(0,11)}</td>
                                                    <td>{obj.purchaseStocks}</td>
                                                    <td>$ {(obj.purchaseStocks * obj.purchasePrice).toFixed(2)}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        {tickersNotFound.length ? (
                            <div className='tables-not-found'>
                                <h3>Tickers not found</h3>
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Ticker</th>
                                                <th>Price</th>
                                                <th>Date</th>
                                                <th>Stocks</th>
                                                <th>Allocation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tickersNotFound.map((obj, i) => 
                                                <tr className='row' key={i}>
                                                    <td>{obj.name}</td>
                                                    <td>$ {obj.purchasePrice}</td>
                                                    <td>{obj.purchaseDate.slice(0,11)}</td>
                                                    <td>{obj.purchaseStocks}</td>
                                                    <td>$ {(obj.purchaseStocks * obj.purchasePrice).toFixed(2)}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                </div>
                <button
                    type='button'
                    id='close'
                    onClick={() => {
                        dispatch(closeIP())
                        dispatch(emptyTickersIncomplete())
                    }}
                >
                    <IoMdClose />
                </button>
            </div>
        </div>
    );
};

export default IncompletePortfolio;