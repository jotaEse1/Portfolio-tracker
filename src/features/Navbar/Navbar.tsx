import { useAppSelector } from '../../hooks/hooks';
import './Navbar.css'

const Navbar = () => {
    const {currentPortfolio} = useAppSelector(state => state.dashboard)

    return (
        <header className='header'>
            <h2>{currentPortfolio.name}</h2>
        </header>
    );
};

export default Navbar;