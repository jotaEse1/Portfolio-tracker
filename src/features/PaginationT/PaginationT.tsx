import { useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { GraphReturns } from '../../types/types';
import './PaginationT.css'

interface Props {
    data: {[key: string]: GraphReturns},
    keys: string[],
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    datesXPage: number
}

const PaginationT: React.FC<Props> = ({ data, keys, currentPage, setCurrentPage, datesXPage}) => {
    const [tickerFlows, setTickerFlows] = useState<{ [key: string]: boolean }>({})
    
    const totalDates = keys.length
    const repeat = Math.ceil(totalDates / datesXPage)
    let minLong = 0
    let maxLong = datesXPage
    const dividedDates = []

    for (let index = 0; index < repeat; index++) {
        dividedDates.push(keys.slice(minLong, maxLong))

        minLong += datesXPage
        maxLong += datesXPage
    }


    return (
        <>
            {dividedDates.length && (
                dividedDates[currentPage - 1].map(date => {
                    const d = Math.pow(1 + data[date]['total_%'], -1),
                        gainOrLoss = (data[date].total - (data[date].total * d)).toFixed(2)

                    return (
                        <>
                            <tr key={date}>
                                <td
                                    style={Object.keys(data[date].shares).length ? { cursor: 'pointer' } : {}}
                                    onClick={() => {
                                        if (!tickerFlows[date]) {
                                            setTickerFlows({ ...tickerFlows, [date]: true })
                                        }
                                        if (!!tickerFlows[date]) {
                                            setTickerFlows({ ...tickerFlows, [date]: false })
                                        }
                                    }}
                                    className='td-name-transaction'
                                >
                                    {!tickerFlows[date] && <RiArrowRightSFill />}
                                    {!!tickerFlows[date] && <RiArrowDownSFill />}
                                    {data[date].date}
                                </td>
                                <td>{(data[date]['total_%'] * 100).toFixed(2)} %</td>
                                <td>$ {(data[date].total).toFixed(2)}</td>
                                <td
                                    className={Number(gainOrLoss) >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                >$ {gainOrLoss}</td>
                            </tr>
                            <>
                                {!!tickerFlows[date] && (
                                    Object.keys(data[date].shares).map(ticker => {
                                        const d = Math.pow(1 + data[date].shares[ticker]['%'], -1),
                                            gainOrLoss = (data[date].shares[ticker].value - (data[date].shares[ticker].value * d)).toFixed(2);


                                        return (
                                            <tr key={`${ticker}-${date}`} className='tr-ticker-flow'>
                                                <td className='td-name-flow-transaction'>{ticker}</td>
                                                <td>{(data[date].shares[ticker]['%'] * 100).toFixed(2)} %</td>
                                                <td>$ {(data[date].shares[ticker].value).toFixed(2)}</td>
                                                <td
                                                    className={Number(gainOrLoss) >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                                >$ {gainOrLoss}</td>
                                            </tr>
                                        )
                                    })
                                )}
                            </>
                        </>
                    )
                })
            )}
            {dividedDates.length && (
                <tr style={{ height: '10vh'}}>
                    <td colSpan={4} className='td-control'>
                        <button
                            type='button'
                            onClick={currentPage === 1 ? undefined : () => setCurrentPage(prev => prev - 1)}
                        >
                            <AiOutlineLeft />
                        </button>
                        <p>
                            {currentPage === 1
                                ? 1
                                : (currentPage - 1) * datesXPage
                            }
                            -
                            {currentPage === 1
                                ? dividedDates[0].length
                                : currentPage === repeat
                                    ? totalDates
                                    : currentPage * datesXPage
                            } of {totalDates} transactions
                        </p>
                        <button
                            type='button'
                            onClick={currentPage === repeat ? undefined : () => setCurrentPage(prev => prev + 1)}
                        >
                            <AiOutlineRight />
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
};

export default PaginationT;