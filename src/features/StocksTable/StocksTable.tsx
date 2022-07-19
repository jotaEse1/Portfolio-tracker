import { createRef, useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import './StocksTable.css'
import * as d3 from 'd3'
import { RiArrowRightSFill, RiArrowDownSFill} from 'react-icons/ri'

const StocksTable = () => {
    const { currentPortfolio } = useAppSelector(state => state.dashboard),
        [tickerFlows, setTickerFlows] = useState<{ [key: string]: boolean }>({}),
        allRefs: React.RefObject<SVGSVGElement>[] = new Array(currentPortfolio.tickers.length).fill(1).map(() => createRef()),
        entries = Object.entries(currentPortfolio.returns.graph),
        min: number = entries.length - 7 <= 0 ? 0 : entries.length - 7,
        max = entries.length,
        data = Object.fromEntries(entries.slice(min, max)),
        keys = Object.keys(data),
        portfolioData = {totalShares: 0, totalCostPort: 0};

    useEffect(() => {
        if (!Object.keys(currentPortfolio).length) return;
        if (!currentPortfolio.tickers.length) return;

        for (let i = 0; i < currentPortfolio.tickers.length; i++) {
            const { name } = currentPortfolio.tickers[i];

            miniChart(name, i)
        }

    }, [currentPortfolio])


    function miniChart(ticker: string, i: number) {
        const svg = d3.select(allRefs[i].current),
            box = document.querySelector('.td-chart') as HTMLDivElement,
            width = box.offsetWidth,
            height = box.offsetHeight,
            paddingLeft = 0;

        //to remove previuos axes and the bar chart
        d3.selectAll(`.${ticker}`)
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()
        
        //scales
        const minDate = d3.min(keys, d => Number(d.slice(1))),
            maxDate = d3.max(keys, d => Number(d.slice(1))),
            maxPrice = d3.max(keys, d => data[d].shares[ticker]['%Acumulated']),
            minPrice = d3.min(keys, d => data[d].shares[ticker]['%Acumulated']),
            paddingDates = 30000000;

        const xScale = d3.scaleTime()
            .domain([minDate!, maxDate!])
            .range([paddingLeft, width - 10])

        const yScale = d3.scaleLinear()
            .domain([minPrice!, maxPrice!])
            .range([height - 25, 10])

        //gradient for area chart
        var lg = svg.append("defs").append("linearGradient")
            .attr("id", "mini")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")//vertical --> y1 =/= y2 and x1 === x2;

        lg.append("stop")
            .attr("offset", "0%")
            .attr('stop-color', currentPortfolio.tickers[i].returns._1Month['%'] >= 0 ? "#47b87750" : "#f63b4050")
            .style("stop-opacity", 1)

        lg.append("stop")
            .attr("offset", "65%")
            .attr('stop-color', currentPortfolio.tickers[i].returns._1Month['%'] >= 0 ? "#47b87720" : "#f63b4020")
            .style("stop-opacity", 1)

        lg.append("stop")
            .attr("offset", "100%")
            .attr('stop-color', 'transparent')
            .style("stop-opacity", 1)

        //line chart
        const path = svg.append("path")
            .datum(keys)
            .attr("fill", "none")
            .attr("stroke", currentPortfolio.tickers[i].returns._1Month['%'] >= 0 ? "#47b877" : "#f63b40")
            .attr('class',`${ticker}`)
            .attr("stroke-width", 2)
            .attr("d", d3.line<any>()
                .x((d: string) => xScale(Number(d.slice(1))))
                .y((d: string) => yScale(data[d].shares[ticker]['%Acumulated']))
                .curve(d3.curveCatmullRom.alpha(0.5))
            )

        const pathLength = path.node()!.getTotalLength();

        const transitionPath: any = d3.transition()
            .ease(d3.easeExp)
            .duration(3000);

        path.attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath)
            .attr("stroke-dashoffset", 0);

        //area chart
        svg.append('path')
            .datum(keys)
            .style('opacity', 0)
            .attr('class',`${ticker}`)
            .attr("fill", 'url(#mini)')
            .attr('d', d3.area<any>()
                .x((d: string) => xScale(Number(d.slice(1))))
                .y0(height - 25)
                .y1(height - 25)
                .curve(d3.curveCatmullRom.alpha(0.5))
            )
            .transition().ease(d3.easeExp).duration(3100)
            .style('opacity', 1)
            .attr('d', d3.area<any>()
                .x((d: string) => xScale(Number(d.slice(1))))
                .y0(height - 25)
                .y1((d: string) => yScale(data[d].shares[ticker]['%Acumulated']))
                .curve(d3.curveCatmullRom.alpha(0.5))
            )
    }

    return (
        <div className='stockTable-container'>
            <h2>Portfolio Assets Returns</h2>
            <div className='stockTable-buttons-container'>
                <button>Add Asset</button>
                <button>Search Assets</button>
                <button>Remove Asset</button>
            </div>
            <div className='stockTable-table-container'>
                <table>
                    <thead>
                        <tr>
                            <th className='th-name'>Ticker</th>
                            <th>Shares</th>
                            <th>Total Cost</th>
                            <th>Market Value</th>
                            <th>Gain/Loss</th>
                            <th>Cost Price</th>
                            <th>Market Price</th>
                            <th>Allocation</th>
                            <th>1D %</th>
                            <th>1M %</th>
                            <th>3M %</th>
                            <th>6M %</th>
                            <th>YTD %</th>
                            <th>Last 1M</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPortfolio.tickers.length ? (
                            currentPortfolio.tickers.map((ticker, i) => {
                                const moneyIn = !!ticker.sharesFlow.in.total ? ticker.sharesFlow.in.total : 0,  
                                    sharesIn = !!ticker.sharesFlow.in.totalIn ? ticker.sharesFlow.in.totalIn : 0,
                                    totalShares = sharesIn + Number(ticker.purchaseStocks),
                                    totalCost = Number(((ticker.purchasePrice * ticker.purchaseStocks) + moneyIn).toFixed(2)),
                                    currentValue = Number((totalShares * ticker.currentPrice).toFixed(2));

                                    portfolioData.totalShares += totalShares
                                    portfolioData.totalCostPort += totalCost

                                return (
                                    <>
                                        <tr key={ticker.id}>
                                            <td
                                                className='td-name'
                                                style={sharesIn > 0 ? { cursor: 'pointer' } : {}}
                                                onClick={() => {
                                                    if (sharesIn > 0 && !tickerFlows[ticker.name]) {
                                                        setTickerFlows({ ...tickerFlows, [ticker.name]: true })
                                                    }
                                                    if (ticker.name in tickerFlows && !!tickerFlows[ticker.name]) {
                                                        setTickerFlows({ ...tickerFlows, [ticker.name]: false })
                                                    }
                                                }}
                                            >
                                                {(sharesIn > 0 && !tickerFlows[ticker.name]) && <RiArrowRightSFill />}
                                                {tickerFlows[ticker.name] && <RiArrowDownSFill />}
                                                {ticker.name}
                                            </td>
                                            <td>{totalShares}</td>
                                            <td>$ {totalCost}</td>
                                            <td>$ {currentValue}</td>
                                            <td
                                                className={currentValue - totalCost >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                            >$ {(currentValue - totalCost).toFixed(2)}</td>
                                            <td>$ {(totalCost / totalShares).toFixed(2)} </td>
                                            <td>$ {(ticker.currentPrice).toFixed(2)}</td>
                                            <td>{(currentValue / currentPortfolio.value * 100).toFixed(2)} %</td>
                                            <td
                                                className={ticker.returns._1Day['%'] >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                            >{(ticker.returns._1Day['%'] * 100).toFixed(2)} %</td>
                                            <td
                                                className={ticker.returns._1Month['%'] >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                            >{(ticker.returns._1Month['%'] * 100).toFixed(2)} %</td>
                                            <td
                                                className={ticker.returns._3Months['%'] >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                            >{(ticker.returns._3Months['%'] * 100).toFixed(2)} %</td>
                                            <td
                                                className={ticker.returns._6Months['%'] >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                            >{(ticker.returns._6Months['%'] * 100).toFixed(2)} %</td>
                                            <td
                                                className={ticker.returns.YTD['%'] >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                            >{(ticker.returns.YTD['%'] * 100).toFixed(2)} %</td>
                                            <td className='td-chart'>
                                                <svg
                                                    ref={allRefs[i]}
                                                    height={'100%'}
                                                    width={'100%'}
                                                ></svg>
                                            </td>
                                        </tr>
                                        <>
                                            {tickerFlows[ticker.name] && ( 
                                                Object.keys(ticker.sharesFlow.in.shares).map((key, i) => { 
                                                    if (i === 0){
                                                        const totalCostInfo = (Number(ticker.purchaseStocks) * Number(ticker.purchasePrice)).toFixed(2),
                                                            marketValueInfo = ((Number(ticker.purchaseStocks) * Number(ticker.currentPrice))).toFixed(2),
                                                            netValueInfo = (Number(marketValueInfo) - Number(totalCostInfo)).toFixed(2),
                                                            totalCostInfoAdd = (Number(ticker.sharesFlow.in.shares[key].purchaseStocks) * Number(ticker.sharesFlow.in.shares[key].purchasePrice)).toFixed(2),
                                                            marketValueInfoAdd = ((Number(ticker.sharesFlow.in.shares[key].purchaseStocks) * Number(ticker.currentPrice))).toFixed(2),
                                                            netValueInfoAdd = (Number(marketValueInfoAdd) - Number(totalCostInfoAdd)).toFixed(2);

                                                        return (
                                                            <>
                                                                <tr key={key + i} className='tr-ticker-flow'>
                                                                    <td className='td-name-flow'>-- {ticker.purchaseDate.slice(0,11)}</td>
                                                                    <td>{ticker.purchaseStocks}</td>
                                                                    <td>$ {totalCostInfo}</td>
                                                                    <td>$ {marketValueInfo}</td>
                                                                    <td
                                                                        className={Number(netValueInfo) >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                                                    >$ {netValueInfo} </td>
                                                                    <td>$ {ticker.purchasePrice}</td>
                            
                                                                    <td colSpan={8}></td>
                                                                </tr>
                                                                <tr key={key + netValueInfoAdd} className='tr-ticker-flow'>
                                                                    <td className='td-name-flow'>-- {ticker.sharesFlow.in.shares[key].purchaseDate.slice(0,11)}</td>
                                                                    <td>{ticker.sharesFlow.in.shares[key].purchaseStocks}</td>
                                                                    <td>$ {totalCostInfoAdd}</td>
                                                                    <td>$ {marketValueInfoAdd}</td>
                                                                    <td
                                                                        className={Number(netValueInfoAdd) >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                                                    >$ {netValueInfoAdd} </td>
                                                                    <td>$ {ticker.sharesFlow.in.shares[key].purchasePrice}</td>
                                                                    <td colSpan={8}></td>
                                                                </tr>
                                                            
                                                            </>
                                                        )
                                                    }
                                                    
                                                    const totalCostInfo = (Number(ticker.sharesFlow.in.shares[key].purchaseStocks) * Number(ticker.sharesFlow.in.shares[key].purchasePrice)).toFixed(2),
                                                        marketValueInfo = ((Number(ticker.sharesFlow.in.shares[key].purchaseStocks) * Number(ticker.currentPrice))).toFixed(2),
                                                        netValueInfo = (Number(marketValueInfo) - Number(totalCostInfo)).toFixed(2);

                                                    return (
                                                        <tr key={key + i} className='tr-ticker-flow'>
                                                            <td className='td-name-flow'>-- {ticker.sharesFlow.in.shares[key].purchaseDate.slice(0,11)}</td>
                                                            <td>{ticker.sharesFlow.in.shares[key].purchaseStocks}</td>
                                                            <td>$ {totalCostInfo}</td>
                                                            <td>$ {marketValueInfo}</td>
                                                            <td
                                                                className={Number(netValueInfo) >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                                            >$ {netValueInfo} </td>
                                                            <td>$ {ticker.sharesFlow.in.shares[key].purchasePrice}</td>
                                                            <td colSpan={8}></td>
                                                        </tr>
                                                    )

                                                })
                                            )}
                                        </>
                                    </>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={14}>
                                    No Assets
                                </td>
                            </tr>
                        )}
                        {currentPortfolio.tickers.length ? (
                            <tr>
                                <td className='td-name'>{currentPortfolio.name}</td>
                                <td>{portfolioData.totalShares}</td>
                                <td>$ {(portfolioData.totalCostPort).toFixed(2)}</td>
                                <td>$ {currentPortfolio.value}</td>
                                <td
                                    className={currentPortfolio.value - portfolioData.totalCostPort >= 0 ? 'return-table-positive' : 'return-table-negative'}
                                >$ {(currentPortfolio.value - portfolioData.totalCostPort).toFixed(2)}</td>
                                <td>$ {(portfolioData.totalCostPort / portfolioData.totalShares).toFixed(2)}</td>
                                <td>$ {(currentPortfolio.value / portfolioData.totalShares).toFixed(2)}</td>
                                <td>100%</td>
                                <td colSpan={6}></td>
                            </tr>
                        ):(
                            <></>
                        )}



                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StocksTable;