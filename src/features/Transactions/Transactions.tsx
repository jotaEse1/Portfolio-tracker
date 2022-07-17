import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { openDashboard } from '../Dashboard/DashboardSlice';
import PaginationT from '../PaginationT/PaginationT';
import './Transactions.css'
import { closeTransactions } from './TransactionsSlice';
import { VscTriangleUp, VscTriangleDown } from 'react-icons/vsc'
import { BsArrowBarLeft } from 'react-icons/bs'
import Navbar from '../Navbar/Navbar';

const Transactions = () => {
    const { currentPortfolio } = useAppSelector(state => state.dashboard)
    const [currentPage, setCurrentPage] = useState(1);
    const [graphKeys, setGraphKeys] = useState(Object.keys(currentPortfolio.returns.graph))
    const [datesXPage, setDatesXPage] = useState(10)
    const [order, setOrder] = useState('asc')
    const dispatch = useAppDispatch()

    const sortTableByDate = (order: string) => {
        const keysCopy = JSON.parse(JSON.stringify(graphKeys))

        if (order === 'asc') {
            setOrder('asc')
            keysCopy.sort((a: string, b: string) => Number(a.slice(1)) - Number(b.slice(1)))
            setGraphKeys(keysCopy)
        } else {
            setOrder('desc')
            keysCopy.sort((a: string, b: string) => Number(b.slice(1)) - Number(a.slice(1)))
            setGraphKeys(keysCopy)
        }
    }

    return (
        <div className='transactions-container'>
            <Navbar />
            <div className='button-container'>
                <button
                    type='button'
                    onClick={() => {
                        dispatch(closeTransactions())
                        dispatch(openDashboard())
                    }}
                >
                    <BsArrowBarLeft />
                    Portfolio
                </button>
                <h2>Portfolio Daily Transactions</h2>
            </div>
            <div className='pagination-info-container'>
                <label htmlFor="limit">Transactions per page: </label>
                <select
                    name='limit'
                    id='limit'
                    value={datesXPage}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDatesXPage(Number(e.target.value))}
                >
                    <option value='10'>10</option>
                    <option value='20'>20</option>
                    <option value='30'>30</option>
                    <option value='40'>40</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                </select>

            </div>
            <div className='transactions-table-container'>
                <table>
                    <thead>
                        <tr>
                            <th className='th-name-transaction'>
                                <div>
                                    {order === 'asc' ? (
                                        <p onClick={() => sortTableByDate('des')}>
                                            <VscTriangleUp />
                                        </p>

                                    ) : (
                                        <p onClick={() => sortTableByDate('asc')}>
                                            <VscTriangleDown />
                                        </p>
                                    )}
                                </div>
                                Date
                            </th>
                            <th>%</th>
                            <th>Value</th>
                            <th>Gain/Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        {graphKeys.length ? (
                            <PaginationT
                                data={currentPortfolio.returns.graph}
                                keys={graphKeys}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                datesXPage={datesXPage}
                            />
                        ) : (
                            <tr>
                                <td colSpan={4}>No transactions</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;