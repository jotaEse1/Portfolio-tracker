import './App.css';
import Dashboard from './features/Dashboard/Dashboard';
import Home from './features/Home/Home';
import AllPortfolios from './features/AllPortfolios/AllPortfolios';
import { useAppSelector } from './hooks/hooks';
import Colors from './features/Colors/Colors';
import PortfolioModal from './features/PortfolioModal/PortfolioModal';
import Loader from './features/Loader/Loader';
import TickerInfo from './features/TickerInfo/TickerInfo';
import HoldingsModal from './features/HoldingsModal/HoldingsModal';
import Transactions from './features/Transactions/Transactions';
import Ticker from './features/Ticker/Ticker';

function App() {
  const { isHomeOpen } = useAppSelector(state => state.home)
  const { isDashboardOpen } = useAppSelector(state => state.dashboard)
  const { portfoliosOpen } = useAppSelector(state => state.home)
  const { color } = useAppSelector(state => state.colors)
  const { isOpenPM } = useAppSelector(state => state.portfolioModal)
  const {isLoaderOpen} = useAppSelector(state => state.loader)
  const {isOpenTI} = useAppSelector(state => state.tickerInforamtion)
  const { isOpenHM } = useAppSelector(state => state.holdingsModal)
  const {isOpenT} = useAppSelector(state => state.transactions)
  const {isTickerOpen} = useAppSelector(state => state.ticker)

  return (
    <div className='app' data-theme={color.name}>
      {isHomeOpen && <Home />}
      {isDashboardOpen && <Dashboard />}
      {isTickerOpen && <Ticker />}
      {portfoliosOpen && <AllPortfolios />}
      <Colors />
      {isOpenPM && <PortfolioModal />}
      {isOpenHM && <HoldingsModal />}
      {isOpenTI && <TickerInfo />}
      {isLoaderOpen &&
        <div className='loader-container'>
          <Loader />
        </div>
      }
      {isOpenT && <Transactions />}
    </div>
  );
}

export default App;
