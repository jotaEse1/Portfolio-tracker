import { useAppSelector } from '../../hooks/hooks';
import PanelSquare from '../PanelSquare/PanelSquare';
import './Panel.css'

const Panel = () => {
    const {currentPortfolio} = useAppSelector(state => state.dashboard)
    const {_1M, _3M, _6M, YTD, SI} = useAppSelector(state => state.panel)

    return (
        <div className='panel-container'>
            <h2>Portfolio Returns</h2>
            <div>
                <PanelSquare 
                    title='1 Month'
                    period='_1M'
                    method={_1M}
                    gain={currentPortfolio.returns.portfolioReturns._1Month['%'] || 0}
                    value={currentPortfolio.value}
                />
                <PanelSquare 
                    title='3 Months'
                    period='_3M'
                    method={_3M}
                    gain={currentPortfolio.returns.portfolioReturns._3Months['%'] || 0}
                    value={currentPortfolio.value}
                />
                <PanelSquare 
                    title='6 Months'
                    period='_6M'
                    method={_6M}
                    gain={currentPortfolio.returns.portfolioReturns._6Months['%'] || 0}
                    value={currentPortfolio.value}
                />
                <PanelSquare 
                    title='YTD'
                    period='YTD'
                    method={YTD}
                    gain={currentPortfolio.returns.portfolioReturns.YTD['%'] || 0}
                    value={currentPortfolio.value}
                />
                <PanelSquare 
                    title='Since Inception'
                    period='SI'
                    method={SI}
                    gain={currentPortfolio.returns.portfolioReturns.sinceInception['%'] || 0}
                    value={currentPortfolio.value}
                />
            </div>
        </div>
    );
};

export default Panel;