import './PanelSquare.css'
import {RiArrowUpSFill, RiArrowDownSFill} from 'react-icons/ri'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { changeSquare } from '../Panel/PanelSlice';

interface Props {
    title: string,
    period: string,
    method: string,
    gain: number,
    value: number
}

const PanelSquare: React.FC<Props> = ({title, period, method, gain, value}) => {
    const dispatch = useAppDispatch();

    return (
        <div className='square-container'>
            <div className='square-information'>
                <h6>{title}</h6>
                <p
                    onClick={() => {
                        if(method === '%') dispatch(changeSquare({period, method: '$'}))
                        else dispatch(changeSquare({period, method: '%'}))
                    }}
                    className={gain >= 0? 'return-positive' : 'return-negative'}
                    style={{cursor: 'pointer'}}
                >
                    {method === '%'? (
                        gain >= 0? (
                            <>
                                <RiArrowUpSFill />
                                {(gain).toFixed(2)} %
                            
                            </>
                        ):(
                            <>
                                <RiArrowDownSFill />
                                {`${(gain).toFixed(2)}`.slice(1)} %
                            
                            </>
                        )
                    ):(
                        gain >= 0? (
                            <>
                                <RiArrowUpSFill />
                                $ {( value - (value * Math.pow(1 + (gain / 100), -1) ) ).toFixed(2)}
                            
                            </>
                        ):(
                            <>
                                <RiArrowDownSFill />
                                $ {(( value - (value * Math.pow(1 + (gain / 100), -1) ) ).toFixed(2)).slice(1)}
                            
                            </>
                        )
                    )}
                </p>
            </div>
            <div className='square-detail'></div>
        
        </div>
    );
};

export default PanelSquare;

/* 
const d = Math.pow(1 + data[date]['total_%'], -1),
gainOrLoss = (data[date].total - (data[date].total * d)).toFixed(2)
*/