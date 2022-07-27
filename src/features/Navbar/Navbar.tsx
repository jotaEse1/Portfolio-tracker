import { useAppSelector } from '../../hooks/hooks';
import './Navbar.css'
import Colors from '../Colors/Colors';
import Dropdown from '../Dropdown/Dropdown';

interface Props {
    ui: string
}

const Navbar: React.FC<Props> = ({ ui }) => {
    const { currentPortfolio } = useAppSelector(state => state.dashboard)

    return (
        <header className='header'>
            <Colors />
            {ui === 'special' && <h2>{currentPortfolio.name}</h2>}
            {ui === 'portfolio' && <h2>Portfolios</h2>}
            {ui === 'ticker' && <h2>Ticker</h2>}
            <Dropdown ui={ui}/>
        </header>
    );
};

export default Navbar;