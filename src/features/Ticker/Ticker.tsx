import { useAppSelector } from '../../hooks/hooks';
import TickerChart from '../TickerChart/TickerChart';
import TickerDescription from '../TickerDescription/TickerDescription';
import TickerDetails from '../TickerDetails/TickerDetails';
import './Ticker.css'

const Ticker = () => {
    const {isTickerSet} = useAppSelector(state => state.ticker)

    return (
        <div className='ticker-container'>
            <TickerDescription />
            {isTickerSet && (
                <>
                    <TickerDetails />
                    <TickerChart />
                </>
            )}
            
            
            <div></div>
        </div>
    );
};

export default Ticker;