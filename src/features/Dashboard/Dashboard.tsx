import './Dashboard.css'
import SideBar from '../SideBar/SideBar';
import Chart from '../Chart/Chart';
import Panel from '../Panel/Panel';
import StocksTable from '../StocksTable/StocksTable';
import Navbar from '../Navbar/Navbar';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import RenameModal from '../RenameModal/RenameModal';
import ModalMsg from '../ModalMsg/ModalMsg';
import Loader from '../Loader/Loader';

const Dashboard = () => {
    const {portfolios} = useAppSelector(state => state.dashboard);
    const {isRenameOpen} = useAppSelector(state => state.renameModal)
    const {isOpenMM} = useAppSelector(state => state.modalMsg)
    const {isLoaderOpen} = useAppSelector(state => state.loader)
    const dispatch = useAppDispatch();

    return (
        <div className='dashboard-container'>
            <Navbar ui='special'/>
            <Panel />
            <SideBar />
            <Chart />
            <StocksTable />
            {isOpenMM && <ModalMsg />}
            {isRenameOpen && <RenameModal />}
            {isLoaderOpen && 
                <div className='loader-container'>
                    <Loader />
                </div>
            }
        </div>
    );
};

export default Dashboard;