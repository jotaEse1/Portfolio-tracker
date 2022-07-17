import { useAppSelector } from '../../hooks/hooks';
import './TickerDetails.css'

const TickerDetails = () => {
    const { fundamentalTicker } = useAppSelector(state => state.ticker)

    return (
        <div className='ticker-factors-container'>
            <div className='ticker-factor'>
                <table className='ticker-factor-content'>
                    <tbody>
                        <tr>
                            <td>Shares Outstanding</td>
                            <td>{(fundamentalTicker.sharesOutstanding / 1000000000).toFixed(3)}B</td>
                        </tr>
                        <tr>
                            <td>Market Cap.</td>
                            <td>{fundamentalTicker.marketCap|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Beta</td>
                            <td>{fundamentalTicker.beta|| '----'}</td>
                        </tr>
                        <tr>
                            <td>High 52</td>
                            <td>$ {fundamentalTicker.high52|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Low 52</td>
                            <td>$ {fundamentalTicker.low52|| '----'}</td>
                        </tr>
                        <tr>
                            <td>PE Ratio</td>
                            <td>{fundamentalTicker.peRatio|| '----'}</td>
                        </tr>
                        <tr>
                            <td>PEG Ratio</td>
                            <td>{fundamentalTicker.pegRatio|| '----'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='ticker-factor'>
                <table className='ticker-factor-content'>
                    <tbody>
                        <tr>
                            <td>Debt to Equity</td>
                            <td>{fundamentalTicker.totalDebtToEquity|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Div. Amount</td>
                            <td>{fundamentalTicker.dividendAmount|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Div. Yield</td>
                            <td>{fundamentalTicker.dividendYield|| '----'}%</td>
                        </tr>
                        <tr>
                            <td>Div. Date</td>
                            <td>{fundamentalTicker.dividendDate.slice(0,11)|| '----'}</td>
                        </tr>
                        <tr>
                            <td>DGR 3Y</td>
                            <td>{fundamentalTicker.divGrowthRate3Year|| '----'}%</td>
                        </tr>
                        <tr>
                            <td>Div. Pay Amount</td>
                            <td>$ {fundamentalTicker.dividendPayAmount|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Div. Pay Date</td>
                            <td>{fundamentalTicker.dividendPayDate.slice(0,11)|| '----'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='ticker-factor'>
                <table className='ticker-factor-content'>
                    <tbody>
                        <tr>
                            <td>Current Ratio</td>
                            <td>{fundamentalTicker.currentRatio|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Net Profit Margin</td>
                            <td>{fundamentalTicker.netProfitMarginTTM|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Operating Margin</td>
                            <td>{fundamentalTicker.operatingMarginTTM|| '----'}</td>
                        </tr>
                        <tr>
                            <td>Quick Ratio (A/P)</td>
                            <td>{fundamentalTicker.quickRatio|| '----'}</td>
                        </tr>
                        <tr>
                            <td>PB Ratio</td>
                            <td>{fundamentalTicker.pbRatio|| '----'}</td>
                        </tr>
                        <tr>
                            <td>EPS</td>
                            <td>{fundamentalTicker.epsTTM|| '----'}</td>
                        </tr>
                        <tr>
                            <td>BV per Share</td>
                            <td>{fundamentalTicker.bookValuePerShare|| '----'}</td>
                        </tr>
                        
                        
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TickerDetails;