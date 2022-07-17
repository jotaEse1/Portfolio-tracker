import { TickerRow } from '../../types/types';
import './PMRow.css'
import { BsPencilSquare } from 'react-icons/bs'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { setPMRow } from './PMRowSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { openTI, setAdd, setModify } from '../TickerInfo/TickerInfoSlice';
import { deleteTickerRow } from '../PortfolioModal/PortfolioModalSlice'

interface Props {
    tickerInfo: TickerRow
}

const PMRow: React.FC<Props> = ({ tickerInfo }) => {
    const { ui, isOpenHM } = useAppSelector(state => state.holdingsModal)
    const dispatch = useAppDispatch();
    const { name, purchasePrice, purchaseDate, purchaseStocks } = tickerInfo;

    return (
        <>
            <td>{name}</td>
            <td>$ {purchasePrice}</td>
            <td>{purchaseDate.slice(0, 10)}</td>
            <td>{purchaseStocks}</td>
            <td>$ {(purchasePrice * purchaseStocks).toFixed(2)} </td>
            {isOpenHM ? (
                <td>
                    {ui === 'edit' && (
                        <button
                            name='edit'
                            title='Edit ticker'
                            type='button'
                            onClick={() => {
                                dispatch(setPMRow({ ...tickerInfo, purchaseDate: purchaseDate.slice(0, 10) }))
                                dispatch(setModify())
                                dispatch(openTI())
                            }}
                        >
                            <BsPencilSquare />
                        </button>
                    )}
                    {ui === 'delete' && (
                        <button
                            name='delete'
                            title='Delete ticker'
                            type='button'
                            onClick={() => {
                                dispatch(deleteTickerRow(tickerInfo))
                                dispatch(setAdd())
                            }}
                        >
                            <RiDeleteBin5Fill />
                        </button>
                    )}
                    {(ui === 'add' || ui === 'sell') && (
                        <>
                            <button
                                name='edit'
                                title='Edit ticker'
                                type='button'
                                onClick={() => {
                                    dispatch(setPMRow({ ...tickerInfo, purchaseDate: purchaseDate.slice(0, 10) }))
                                    dispatch(setModify())
                                    dispatch(openTI())
                                }}
                            >
                                <BsPencilSquare />
                            </button>
                            <button
                                name='delete'
                                title='Delete ticker'
                                type='button'
                                onClick={() => {
                                    dispatch(deleteTickerRow(tickerInfo))
                                    dispatch(setAdd())
                                }}
                            >
                                <RiDeleteBin5Fill />
                            </button>
                        </>
                    )}
                </td>
            ) : (
                <td>
                    <button
                        name='edit'
                        title='Edit ticker'
                        type='button'
                        onClick={() => {
                            dispatch(setPMRow({ ...tickerInfo, purchaseDate: purchaseDate.slice(0, 10) }))
                            dispatch(setModify())
                            dispatch(openTI())
                        }}
                    >
                        <BsPencilSquare />
                    </button>
                    <button
                        name='delete'
                        title='Delete ticker'
                        type='button'
                        onClick={() => {
                            dispatch(deleteTickerRow(tickerInfo))
                            dispatch(setAdd())
                        }}
                    >
                        <RiDeleteBin5Fill />
                    </button>
                </td>
            )}
        </>
    );
};

export default PMRow;