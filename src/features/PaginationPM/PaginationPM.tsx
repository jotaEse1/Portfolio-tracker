import { TickerRow } from '../../types/types';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai'
import './PaginationPM.css'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { openTI, setAdd } from '../TickerInfo/TickerInfoSlice';
import { incrementPage, decrementPage } from './PaginationPMSlice';
import PMRow from '../PMRow/PMRow';
import { setPMRow } from '../PMRow/PMRowSlice';
import { useEffect } from 'react';
import { setPortfolioValue } from '../PortfolioModal/PortfolioModalSlice';


interface Props {
    tickers: TickerRow[]
}

const initialForm = {
    name: '',
    purchaseDate: '',
    purchasePrice: 0,
    purchaseStocks: 0
}

const PaginationPM: React.FC<Props> = ({ tickers }) => {
    const { currentPage } = useAppSelector(state => state.paginationPM)
    const { portfolioValue } = useAppSelector(state => state.portfolioModal)
    const { ui, isOpenHM } = useAppSelector(state => state.holdingsModal)
    const dispatch = useAppDispatch();

    useEffect(() => {
        const value = tickers.reduce((acum, curr) => Number((acum + (curr.purchasePrice * curr.purchaseStocks)).toFixed(2)), 0)

        dispatch(setPortfolioValue(value))
    }, [tickers])


    const tickersXPage = 20
    const totalTickers = tickers.length
    const repeat = Math.ceil(totalTickers / tickersXPage)
    let minLong = 0
    let maxLong = tickersXPage
    const dividedTickers = []

    for (let index = 0; index < repeat; index++) {
        dividedTickers.push(tickers.slice(minLong, maxLong))

        minLong += tickersXPage
        maxLong += tickersXPage
    }
    console.log(dividedTickers[currentPage - 1], currentPage)

    return (
        <>
            {dividedTickers[currentPage - 1].map((obj, i) =>
                <tr key={obj.id} className='row'>
                    <PMRow
                        tickerInfo={obj}
                    />
                </tr>
            )}
            {dividedTickers[0][0].name ? (
                <>
                    {isOpenHM ? (
                        ui === 'add' && (
                            <>
                                <tr className='portfolio-value'>
                                    <td colSpan={6} style={{ textAlign: 'center' }}>
                                        <h5>Portfolio Value: <p>$ {portfolioValue}</p></h5>
                                    </td>
                                </tr>
                                <tr className='add-ticker'>
                                    <td colSpan={6}>
                                        <button
                                            onClick={() => {
                                                dispatch(openTI())
                                                dispatch(setPMRow(initialForm))
                                                dispatch(setAdd())
                                            }}
                                            type='button'
                                        >
                                            Add Ticker
                                        </button>
                                    </td>
                                </tr>
                            </>
                        )
                    ) : (
                        <>
                            <tr className='portfolio-value'>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    <h5>Portfolio Value: <p>$ {portfolioValue}</p></h5>
                                </td>
                            </tr>
                            <tr className='add-ticker'>
                                <td colSpan={6}>
                                    <button
                                        onClick={() => {
                                            dispatch(openTI())
                                            dispatch(setPMRow(initialForm))
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
                    <tr className='empty'>
                        <td colSpan={6} className='td-control'>
                            <button
                                type='button'
                                onClick={currentPage === 1 ? undefined : () => dispatch(decrementPage())}
                            >
                                <AiOutlineLeft />
                            </button>
                            <p>
                                {currentPage === 1
                                    ? 1
                                    : (currentPage - 1) * tickersXPage
                                }
                                -
                                {currentPage === 1
                                    ? dividedTickers[0].length
                                    : currentPage === repeat
                                        ? totalTickers
                                        : currentPage * tickersXPage
                                } of {totalTickers} Tickers
                            </p>
                            <button
                                type='button'
                                onClick={currentPage === repeat ? undefined : () => dispatch(incrementPage())}
                            >
                                <AiOutlineRight />
                            </button>
                        </td>
                    </tr>
                </>
            ) : (<></>)
            }
        </>
    );
};

export default PaginationPM;