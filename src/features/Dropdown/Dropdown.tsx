import './Dropdown.css'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { MdMenu } from 'react-icons/md';
import {FiLogOut} from 'react-icons/fi'
import { closeMenu, openMenu } from '../Navbar/NavbarSlice';
import { closeTicker } from '../Ticker/TickerSlice';
import { closePortfolios, openHome } from '../Home/HomeSlice';
import { closeDashboard } from '../Dashboard/DashboardSlice';
import { logOut } from '../Authentication/AuthenticationSlice';
import { IoMdClose } from 'react-icons/io';

interface Props {
    ui: string
}

const Dropdown: React.FC<Props> = ({ui}) => {
    const { isMenuOpen } = useAppSelector(state => state.navbar)
    const dispatch = useAppDispatch()

    const handleHome = () => {
        if (ui === 'ticker') dispatch(closeTicker())
        if (ui === 'portfolio') dispatch(closePortfolios())
        if (ui === 'special') dispatch(closeDashboard())

        dispatch(closeMenu())
        dispatch(openHome())
    }

    const handleLogOut = () => {
        dispatch(logOut())
    }

    const handleMenu = () => {
        !isMenuOpen ? dispatch(openMenu()) : dispatch(closeMenu())
    }

    return (
        <>
            <div
                className='menu-container'
                onClick={handleMenu}
            >
                {isMenuOpen? <IoMdClose /> : <MdMenu />}
            </div>
            {isMenuOpen && (
                <>
                    <div className='arrow-up'></div>
                    <div className='menu-options'>
                        <div onClick={handleHome}>Home</div>
                        <div onClick={handleLogOut}>Log Out <FiLogOut /></div>
                    </div>
                </>
            )}
        </>
    );
};

export default Dropdown;