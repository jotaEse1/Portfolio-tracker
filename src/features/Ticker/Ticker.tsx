import { useAppSelector } from '../../hooks/hooks';
import ModalMsg from '../ModalMsg/ModalMsg';
import Navbar from '../Navbar/Navbar';
import TickerChart from '../TickerChart/TickerChart';
import TickerDescription from '../TickerDescription/TickerDescription';
import TickerDetails from '../TickerDetails/TickerDetails';
import './Ticker.css'

const Ticker = () => {
    const {isTickerSet} = useAppSelector(state => state.ticker);
    const {isOpenMM} = useAppSelector(state => state.modalMsg)

    return (
        <div className='ticker-container'>
            <Navbar ui='ticker'/>
            <TickerDescription />
            {isOpenMM && <ModalMsg />}
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