import { AddMoney, TickerSend, TickerReturns, GraphReturns, PortfolioReturns } from "../types/types"
import { dates } from "./dates"


interface Returns {
    graph: {
        [key: string]: GraphReturns
    },
    portfolio: PortfolioReturns,
    tickers: {
        [key: string]: TickerReturns
    }

     }

/* Calculations --- Weigthed method ----> asset allocation * % return 
Calculation to obtain portfolio returns
    ---> Ticker A (10%) B (60%) C (30%)
    ---> A +2% B -2.50% C +3.54%
    ---> A = $A * (1 + 0.02)

Calculation to obtaion ticker returns
    today unix - 1 day unix
    today unix - 30 days unix ---> since then should compute 1 month returns
    today unix - 90 days unix ---> since then should compute 3 months returns

    And ---> A% = ( 1 + acumulated % ) * ( 1 + current % ) - 1 

Add / Subtract to one stock
    Let's say you want to buy more TSLA shares or sold some of them

    unix --> ticker value + money / ticker value - money
*/

export const assetsConverter = (allTickers: TickerSend[], addMoney: AddMoney, portVal: number, capitalObj: {[key: string]: number}) => {
    const returns: Returns = {
        graph: {},
        portfolio: {
            _1Month: { initial: {}, '%': 0 },
            _3Months: { initial: {}, '%': 0 },
            _6Months: { initial: {}, '%': 0 },
            YTD: { initial: {}, '%': 0 },
            sinceInception: { initial: portVal, '%': 0 }
        },
        tickers: {}
    } as Returns,
        { year, month, date } = dates(Date.now()),
        todayUnix = new Date(`${year}-${month}-${date} 02:00:00`).getTime(),
        _1dayUnix = 86400000,
        _1MonthUnix = todayUnix - (_1dayUnix * 30),
        _3MonthsUnix = todayUnix - (_1dayUnix * 90),
        _6MonthsUnix = todayUnix - (_1dayUnix * 180),
        YTDUnix = new Date(`${year - 1}-12-31 02:00:00`).getTime(),
        firstValue: { [key: string]: number } = {},
        subtractSum: { [key: string]: number } = {},
        allDates: { [key: string]: number } = {},
        tickerShares: { [key: string]: number } = {};

    let lastValue = 0,
        capital = 0;
        

    for (let i = 0; i < allTickers.length; i++) {
        let { purchaseStocks, purchasePrice, purchaseDateUnix, data, name } = allTickers[i],
            tickerValue = Number(((purchasePrice * purchaseStocks)).toFixed(2)),
            tickerPerAcumulated = 0;

        if (!data.length) continue

        firstValue[name] = 0
        tickerShares[name] = Number(purchaseStocks)
        capital = tickerValue;
        

        for (let j = 0; j < data.length; j++) {
            let { close, datetime } = data[j],
                tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close),
                portValue = Number((tickerShares[name] * close).toFixed(2)),
                convert = dates(datetime);

            data[j].datetime = new Date(`${convert.year}-${convert.month}-${convert.date} 02:00:00`).getTime()
            datetime = new Date(`${convert.year}-${convert.month}-${convert.date} 02:00:00`).getTime()
            let { year, month, date } = dates(datetime);

            allDates[`_${datetime}`] = 1
            let allDatesArr = Object.keys(allDates)

            const prevDate = j === 0 ? allDatesArr[allDatesArr.indexOf(`_${datetime}`) - 1] : `_${data[j - 1].datetime}`

            //console.log(capital, name, `${year}-${month}-${date}`)

            //graph returns (since inception)
            if (purchaseDateUnix <= datetime) {
                if (firstValue[name] === 0) {
                    tickerReturn = close === purchasePrice ? 0 : ((close - purchasePrice) / purchasePrice);
                    firstValue[name] = 1;

                    portValue = close === purchasePrice ? Number((tickerShares[name] * close).toFixed(2)) : Number((tickerShares[name] * purchasePrice).toFixed(2));

                    capital = `_${datetime}` in capitalObj? capitalObj[`_${datetime}`] : tickerValue;

                    if (`_${datetime}` in returns.graph && `_${datetime}` !== Object.keys(returns.graph)[0]) {
                        `_${datetime}` in subtractSum
                            ? subtractSum[`_${datetime}`] += Number((purchaseStocks * close).toFixed(2))
                            : subtractSum[`_${datetime}`] = Number((purchaseStocks * close).toFixed(2))
                    }
                }


                if (!returns.graph[`_${datetime}`]) {
                    returns.graph[`_${datetime}`] = {} as GraphReturns

                    tickerValue = Number((tickerValue * (tickerReturn + 1)).toFixed(2))
                    tickerPerAcumulated = (((tickerPerAcumulated + 1) * (1 + tickerReturn)) - 1)

                    if (name in addMoney && `_${datetime}` in addMoney[name]) {
                        tickerShares[name] += Number(addMoney[name][`_${datetime}`].purchaseStocks);

                        portValue += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2));

                        `_${datetime}` in subtractSum
                            ? subtractSum[`_${datetime}`] += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                            : subtractSum[`_${datetime}`] = Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))

                        subtractSum[`_${datetime}`] = Number((subtractSum[`_${datetime}`]).toFixed(2))
                    }

                    if (!returns.graph[`_${datetime}`].shares) {
                        returns.graph[`_${datetime}`].shares = {}

                        returns.graph[`_${datetime}`].shares[name] = {
                            '%': tickerReturn,
                            value: portValue ,
                            '%Acumulated': tickerPerAcumulated
                        }
                        returns.graph[`_${datetime}`]['total'] = portValue
                        returns.graph[`_${datetime}`]['date'] = `${year}-${month}-${date}`
                        

                        if (`_${datetime}` in subtractSum) {
                            const sub = tickerReturn !== 0 && name in addMoney && `_${datetime}` in addMoney[name]? Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2)) : subtractSum[`_${datetime}`]
                            returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `(( (${returns.graph[`_${datetime}`]['total'] - sub}) / ${returns.graph[prevDate]['total']}) - 1)` : 'tickerReturn';
                            returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? (((returns.graph[`_${datetime}`]['total'] - sub) / returns.graph[prevDate]['total']) - 1) : tickerReturn;

                            if (prevDate in returns.graph) {
                                returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1);
                                returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `;
                                
                                if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]

                                returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                                returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                            } else {
                                returns.graph[`_${datetime}`].percentage = 0                                
                                returns.graph[`_${datetime}`].capital = 0
                            }
                        } else {
                            returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `((${returns.graph[`_${datetime}`]['total']} / ${returns.graph[prevDate]['total']}) - 1) ` : '0';
                            returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? ((returns.graph[`_${datetime}`]['total'] / returns.graph[prevDate]['total']) - 1)  : 0;

                            if (prevDate in returns.graph) {
                                returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1)
                                returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `

                                if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]
                                
                                returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                                returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                            } else {
                                returns.graph[`_${datetime}`].percentage = 0
                                returns.graph[`_${datetime}`].capital = 0
                            }
                        }

                    

                    } else {
                        returns.graph[`_${datetime}`].shares[name] = {
                            '%': tickerReturn,
                            value: Number((tickerShares[name] * close).toFixed(2)),
                            '%Acumulated': tickerPerAcumulated
                        }
                        returns.graph[`_${datetime}`]['total'] = Number((tickerShares[name] * close).toFixed(2))
                        returns.graph[`_${datetime}`]['date'] = `${year}-${month}-${date}`


                        if (`_${datetime}` in subtractSum) {
                            const sub = tickerReturn !== 0 && name in addMoney && `_${datetime}` in addMoney[name]? Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2)) : subtractSum[`_${datetime}`]
                            returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `(( (${returns.graph[`_${datetime}`]['total'] - sub}) / ${returns.graph[prevDate]['total']}) - 1) ` : '0';
                            returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? (((returns.graph[`_${datetime}`]['total'] - sub) / returns.graph[prevDate]['total']) - 1) : 0;

                            if (prevDate in returns.graph) {
                                returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1)
                                returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `

                                if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]
                                
                                returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                                returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                            } else {
                                returns.graph[`_${datetime}`].percentage = 0
                                returns.graph[`_${datetime}`].capital = 0
                            }
                        } else {
                            returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `((${returns.graph[`_${datetime}`]['total']} / ${returns.graph[prevDate]['total']}) - 1)` : '0';
                            returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? ((returns.graph[`_${datetime}`]['total'] / returns.graph[prevDate]['total']) - 1) : 0;

                            if (prevDate in returns.graph) {
                                returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1)
                                returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `
                                
                                if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]
                                
                                returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                                returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                            } else {
                                returns.graph[`_${datetime}`].percentage = 0
                                returns.graph[`_${datetime}`].capital = 0
                            }
                        }

                    
                    }

                    //ticker returns
                    if (!returns.tickers[name]) {
                        returns.tickers[name] = {
                            _1Day: { '%': 0 },
                            _1Month: { '%': 0 },
                            _3Months: { '%': 0 },
                            _6Months: { '%': 0 },
                            YTD: { '%': 0 }
                        } as TickerReturns
                    }
                    if (datetime >= _6MonthsUnix) {
                        tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                        returns.tickers[name]['_6Months']['%'] = (((returns.tickers[name]['_6Months']['%'] + 1) * (1 + tickerReturn)) - 1)

                        if (!returns.tickers[name]['_6Months']['startDate']) {
                            returns.tickers[name]['_6Months']['startDate'] = `${year}-${month}-${date}`
                            returns.tickers[name]['_6Months']['initialValue'] = tickerValue
                            returns.tickers[name]['_6Months']['%'] = 0

                            if (_6MonthsUnix >= purchaseDateUnix) {
                                returns.portfolio['_6Months'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                                'total' in returns.portfolio['_6Months'].initial === false
                                    ? returns.portfolio['_6Months'].initial.total = returns.portfolio['_6Months'].initial[name]
                                    : returns.portfolio['_6Months'].initial.total += returns.portfolio['_6Months'].initial[name]

                                returns.portfolio['_6Months'].initial.total = Number((returns.portfolio['_6Months'].initial.total).toFixed(2))
                            }

                        }

                        if (!returns.portfolio['_6Months'].initial[name] && _6MonthsUnix < purchaseDateUnix) {
                            returns.portfolio['_6Months'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                            'total' in returns.portfolio['_6Months'].initial === false
                                ? returns.portfolio['_6Months'].initial.total = returns.portfolio['_6Months'].initial[name]
                                : returns.portfolio['_6Months'].initial.total += returns.portfolio['_6Months'].initial[name]

                            returns.portfolio['_6Months'].initial.total = Number((returns.portfolio['_6Months'].initial.total).toFixed(2))
                        }

                        'subtract' in returns.portfolio['_6Months'] === false
                            ? returns.portfolio['_6Months'].subtract = 0
                            : name in addMoney && `_${datetime}` in addMoney[name]
                                ? returns.portfolio['_6Months'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                                : returns.portfolio['_6Months'].subtract += 0

                        if (i === allTickers.length - 1 && j === data.length - 1) {
                            returns.portfolio._6Months['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['_6Months'].subtract) / returns.portfolio._6Months.initial.total) - 1) * 100
                        }
                    }
                    if (datetime >= _3MonthsUnix) {
                        tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                        returns.tickers[name]['_3Months']['%'] = (((returns.tickers[name]['_3Months']['%'] + 1) * (1 + tickerReturn)) - 1)

                        if (!returns.tickers[name]['_3Months']['startDate']) {
                            returns.tickers[name]['_3Months']['startDate'] = `${year}-${month}-${date}`
                            returns.tickers[name]['_3Months']['initialValue'] = tickerValue
                            returns.tickers[name]['_3Months']['%'] = 0

                            if (_3MonthsUnix >= purchaseDateUnix) {
                                returns.portfolio['_3Months'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                                'total' in returns.portfolio['_3Months'].initial === false
                                    ? returns.portfolio['_3Months'].initial.total = returns.portfolio['_3Months'].initial[name]
                                    : returns.portfolio['_3Months'].initial.total += returns.portfolio['_3Months'].initial[name]

                                returns.portfolio['_3Months'].initial.total = Number((returns.portfolio['_3Months'].initial.total).toFixed(2))
                            }
                        }

                        if (!returns.portfolio['_3Months'].initial[name] && _3MonthsUnix < purchaseDateUnix) {
                            returns.portfolio['_3Months'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                            'total' in returns.portfolio['_3Months'].initial === false
                                ? returns.portfolio['_3Months'].initial.total = returns.portfolio['_3Months'].initial[name]
                                : returns.portfolio['_3Months'].initial.total += returns.portfolio['_3Months'].initial[name]

                            returns.portfolio['_3Months'].initial.total = Number((returns.portfolio['_3Months'].initial.total).toFixed(2))
                        }

                        'subtract' in returns.portfolio['_3Months'] === false
                            ? returns.portfolio['_3Months'].subtract = 0
                            : name in addMoney && `_${datetime}` in addMoney[name]
                                ? returns.portfolio['_3Months'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                                : returns.portfolio['_3Months'].subtract += 0

                        if (i === allTickers.length - 1 && j === data.length - 1) {
                            returns.portfolio._3Months['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['_3Months'].subtract) / returns.portfolio._3Months.initial.total) - 1) * 100
                        }

                    }
                    if (datetime >= _1MonthUnix) {
                        tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                        returns.tickers[name]['_1Month']['%'] = (((returns.tickers[name]['_1Month']['%'] + 1) * (1 + tickerReturn)) - 1)

                        if (!returns.tickers[name]['_1Month']['startDate']) {
                            returns.tickers[name]['_1Month']['startDate'] = `${year}-${month}-${date}`
                            returns.tickers[name]['_1Month']['initialValue'] = tickerValue
                            returns.tickers[name]['_1Month']['%'] = 0

                            // _1month > purchaseDate && ===
                            if (_1MonthUnix >= purchaseDateUnix) {
                                returns.portfolio['_1Month'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                                'total' in returns.portfolio['_1Month'].initial === false
                                    ? returns.portfolio['_1Month'].initial.total = returns.portfolio['_1Month'].initial[name]
                                    : returns.portfolio['_1Month'].initial.total += returns.portfolio['_1Month'].initial[name]

                                returns.portfolio['_1Month'].initial.total = Number((returns.portfolio['_1Month'].initial.total).toFixed(2))
                            }
                        }

                        if (!returns.portfolio['_1Month'].initial[name] && _1MonthUnix < purchaseDateUnix) {
                            returns.portfolio['_1Month'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                            'total' in returns.portfolio['_1Month'].initial === false
                                ? returns.portfolio['_1Month'].initial.total = returns.portfolio['_1Month'].initial[name]
                                : returns.portfolio['_1Month'].initial.total += returns.portfolio['_1Month'].initial[name]

                            returns.portfolio['_1Month'].initial.total = Number((returns.portfolio['_1Month'].initial.total).toFixed(2))
                        }

                        'subtract' in returns.portfolio['_1Month'] === false
                            ? returns.portfolio['_1Month'].subtract = 0
                            : name in addMoney && `_${datetime}` in addMoney[name]
                                ? returns.portfolio['_1Month'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                                : returns.portfolio['_1Month'].subtract += 0

                        if (i === allTickers.length - 1 && j === data.length - 1) {
                            returns.portfolio._1Month['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['_1Month'].subtract) / returns.portfolio._1Month.initial.total) - 1) * 100
                        }
                    }
                    if (datetime >= YTDUnix) {
                        tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                        returns.tickers[name]['YTD']['%'] = (((returns.tickers[name]['YTD']['%'] + 1) * (1 + tickerReturn)) - 1)

                        if (!returns.tickers[name]['YTD']['startDate']) {
                            returns.tickers[name]['YTD']['startDate'] = `${year}-${month}-${date}`
                            returns.tickers[name]['YTD']['initialValue'] = tickerValue
                            returns.tickers[name]['YTD']['%'] = 0

                            // YTD > purchaseDate && ===
                            if (YTDUnix >= purchaseDateUnix) {
                                returns.portfolio['YTD'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                                'total' in returns.portfolio['YTD'].initial === false
                                    ? returns.portfolio['YTD'].initial.total = returns.portfolio['YTD'].initial[name]
                                    : returns.portfolio['YTD'].initial.total += returns.portfolio['YTD'].initial[name]

                                returns.portfolio['YTD'].initial.total = Number((returns.portfolio['YTD'].initial.total).toFixed(2))
                            }
                        }

                        if (!returns.portfolio['YTD'].initial[name] && YTDUnix < purchaseDateUnix) {
                            returns.portfolio['YTD'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                            'total' in returns.portfolio['YTD'].initial === false
                                ? returns.portfolio['YTD'].initial.total = returns.portfolio['YTD'].initial[name]
                                : returns.portfolio['YTD'].initial.total += returns.portfolio['YTD'].initial[name]

                            returns.portfolio['YTD'].initial.total = Number((returns.portfolio['YTD'].initial.total).toFixed(2))
                        }

                        'subtract' in returns.portfolio['YTD'] === false
                            ? returns.portfolio['YTD'].subtract = 0
                            : name in addMoney && `_${datetime}` in addMoney[name]
                                ? returns.portfolio['YTD'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                                : returns.portfolio['YTD'].subtract += 0

                        if (i === allTickers.length - 1 && j === data.length - 1) {
                            returns.portfolio.YTD['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['YTD'].subtract) / returns.portfolio.YTD.initial.total) - 1) * 100
                        }
                    }


                    if (j === data.length - 1) {
                        //tickerReturn = ((close - data[j - 1].close) / data[j - 1].close) //in case 1DayReturn === last day
                        returns.tickers[name]['_1Day']['%'] = (((returns.tickers[name]['_1Day']['%'] + 1) * (1 + tickerReturn)) - 1)
                        returns.tickers[name]['_1Day']['startDate'] = `${year}-${month}-${date}`

                        allTickers[i].returns = returns.tickers[name]
                        allTickers[i].currentPrice = close
                        allTickers[i].sharesFlow.in = addMoney[name] || false
                        allTickers[i].sharesFlow.out = false

                    }
                    if (i === allTickers.length - 1 && j === data.length - 1) {
                        returns.portfolio.sinceInception['%'] = ((returns.graph[`_${datetime}`].total / returns.portfolio.sinceInception.initial) - 1) * 100
                        lastValue = returns.graph[`_${datetime}`].total
                    }

                    continue
                }

                if (name in addMoney && `_${datetime}` in addMoney[name]) {
                    tickerShares[name] += Number(addMoney[name][`_${datetime}`].purchaseStocks);

                    portValue += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2));

                    `_${datetime}` in subtractSum
                        ? subtractSum[`_${datetime}`] += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                        : subtractSum[`_${datetime}`] = Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))

                    subtractSum[`_${datetime}`] = Number((subtractSum[`_${datetime}`]).toFixed(2))
                }

                tickerValue = Number((tickerValue * (tickerReturn + 1)).toFixed(2))
                tickerPerAcumulated = (((tickerPerAcumulated + 1) * (1 + tickerReturn)) - 1)

                if (!returns.graph[`_${datetime}`].shares) {
                    returns.graph[`_${datetime}`].shares = {}

                    returns.graph[`_${datetime}`].shares[name] = {
                        '%': tickerReturn,
                        value: portValue,
                        '%Acumulated': tickerPerAcumulated
                    }
                    returns.graph[`_${datetime}`]['total'] += portValue
                    returns.graph[`_${datetime}`]['total'] = Number((returns.graph[`_${datetime}`]['total']).toFixed(2))
                    returns.graph[`_${datetime}`]['date'] = `${year}-${month}-${date}`


                    if (`_${datetime}` in subtractSum) {
                        const sub = tickerReturn !== 0 && name in addMoney && `_${datetime}` in addMoney[name]? Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2)) : subtractSum[`_${datetime}`]
                        returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `(( (${returns.graph[`_${datetime}`]['total'] - sub}) / ${returns.graph[prevDate]['total']}) - 1)` : '0';
                        returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? (((returns.graph[`_${datetime}`]['total'] - sub) / returns.graph[prevDate]['total']) - 1) : 0;

                        if (prevDate in returns.graph) {
                            returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1)
                            returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `

                            if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]

                            returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                            returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                        } else {
                            returns.graph[`_${datetime}`].percentage = 0
                            returns.graph[`_${datetime}`].capital = 0
                        }
                    } else {
                        returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `((${returns.graph[`_${datetime}`]['total']} / ${returns.graph[prevDate]['total']}) - 1) ` : '0';
                        returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? ((returns.graph[`_${datetime}`]['total'] / returns.graph[prevDate]['total']) - 1) : 0;

                        if (prevDate in returns.graph) {
                            returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1)
                            returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `

                            if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]
                            
                            returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                            returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                        } else {
                            returns.graph[`_${datetime}`].percentage = 0
                            returns.graph[`_${datetime}`].capital = 0
                        }

        
                    }
                } else {
                    returns.graph[`_${datetime}`].shares[name] = {
                        '%': tickerReturn,
                        value: Number((tickerShares[name] * close).toFixed(2)),
                        '%Acumulated': tickerPerAcumulated
                    }
                    returns.graph[`_${datetime}`]['total'] += Number((tickerShares[name] * close).toFixed(2))
                    returns.graph[`_${datetime}`]['total'] = Number((returns.graph[`_${datetime}`]['total']).toFixed(2))
                    returns.graph[`_${datetime}`]['date'] = `${year}-${month}-${date}`


                    if (`_${datetime}` in subtractSum) {
                        const sub = tickerReturn !== 0 && name in addMoney && `_${datetime}` in addMoney[name]? Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2)) : subtractSum[`_${datetime}`]
                        returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `(( (${returns.graph[`_${datetime}`]['total'] - sub}) / ${returns.graph[prevDate]['total']}) - 1) ` : '0';
                        returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? (((returns.graph[`_${datetime}`]['total'] - sub) / returns.graph[prevDate]['total']) - 1) : 0;

                        if (prevDate in returns.graph) {
                            returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1)
                            returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `

                            if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]
                            
                            returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                            returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                        } else {
                            returns.graph[`_${datetime}`].percentage = 0
                            returns.graph[`_${datetime}`].capital = 0
                        }
                    } else {
                        returns.graph[`_${datetime}`]['total_%String'] = prevDate in returns.graph ? `((${returns.graph[`_${datetime}`]['total']} / ${returns.graph[prevDate]['total']}) - 1) ` : '0';
                        returns.graph[`_${datetime}`]['total_%'] = prevDate in returns.graph ? ((returns.graph[`_${datetime}`]['total'] / returns.graph[prevDate]['total']) - 1) : 0;

                        if (prevDate in returns.graph) {
                            returns.graph[`_${datetime}`].percentage = (((returns.graph[prevDate].percentage + 1) * (1 + returns.graph[`_${datetime}`]['total_%'])) - 1)
                            returns.graph[`_${datetime}`].percentageString = `(( (${returns.graph[prevDate].percentage} + 1) * (1 + ${returns.graph["_" + datetime]['total_%']}) ) - 1) `

                            if(`_${datetime}` in capitalObj) capital = capitalObj[`_${datetime}`]
                            
                            returns.graph[`_${datetime}`].capital = ((returns.graph[`_${datetime}`]['total'] / capital) - 1)
                            returns.graph[`_${datetime}`]['capital_string'] = `((${returns.graph["_" + datetime]['total']} / ${capital}) - 1)`                            

                        } else {
                            returns.graph[`_${datetime}`].percentage = 0
                            returns.graph[`_${datetime}`].capital = 0
                        }
                    }
                }
            }

            //ticker and portfolio returns
            if (!returns.tickers[name]) {
                returns.tickers[name] = {
                    _1Day: { '%': 0 },
                    _1Month: { '%': 0 },
                    _3Months: { '%': 0 },
                    _6Months: { '%': 0 },
                    YTD: { '%': 0 }
                } as TickerReturns
            }
            if (datetime >= _6MonthsUnix) {
                tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                returns.tickers[name]['_6Months']['%'] = (((returns.tickers[name]['_6Months']['%'] + 1) * (1 + tickerReturn)) - 1)

                if (!returns.tickers[name]['_6Months']['startDate']) {
                    returns.tickers[name]['_6Months']['startDate'] = `${year}-${month}-${date}`
                    returns.tickers[name]['_6Months']['initialValue'] = tickerValue
                    returns.tickers[name]['_6Months']['%'] = 0

                    if (_6MonthsUnix >= purchaseDateUnix) {
                        returns.portfolio['_6Months'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                        'total' in returns.portfolio['_6Months'].initial === false
                            ? returns.portfolio['_6Months'].initial.total = returns.portfolio['_6Months'].initial[name]
                            : returns.portfolio['_6Months'].initial.total += returns.portfolio['_6Months'].initial[name]

                        returns.portfolio['_6Months'].initial.total = Number((returns.portfolio['_6Months'].initial.total).toFixed(2))
                    }
                }

                if (!returns.portfolio['_6Months'].initial[name] && _6MonthsUnix < purchaseDateUnix) {
                    returns.portfolio['_6Months'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                    'total' in returns.portfolio['_6Months'].initial === false
                        ? returns.portfolio['_6Months'].initial.total = returns.portfolio['_6Months'].initial[name]
                        : returns.portfolio['_6Months'].initial.total += returns.portfolio['_6Months'].initial[name]

                    returns.portfolio['_6Months'].initial.total = Number((returns.portfolio['_6Months'].initial.total).toFixed(2))
                }

                'subtract' in returns.portfolio['_6Months'] === false
                    ? returns.portfolio['_6Months'].subtract = 0
                    : name in addMoney && `_${datetime}` in addMoney[name]
                        ? returns.portfolio['_6Months'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                        : returns.portfolio['_6Months'].subtract += 0

                if (i === allTickers.length - 1 && j === data.length - 1) {
                    returns.portfolio._6Months['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['_6Months'].subtract) / returns.portfolio._6Months.initial.total) - 1) * 100
                }
            }
            if (datetime >= _3MonthsUnix) {
                tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                returns.tickers[name]['_3Months']['%'] = (((returns.tickers[name]['_3Months']['%'] + 1) * (1 + tickerReturn)) - 1)

                if (!returns.tickers[name]['_3Months']['startDate']) {
                    returns.tickers[name]['_3Months']['startDate'] = `${year}-${month}-${date}`
                    returns.tickers[name]['_3Months']['initialValue'] = tickerValue
                    returns.tickers[name]['_3Months']['%'] = 0

                    if (_3MonthsUnix >= purchaseDateUnix) {
                        returns.portfolio['_3Months'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                        'total' in returns.portfolio['_3Months'].initial === false
                            ? returns.portfolio['_3Months'].initial.total = returns.portfolio['_3Months'].initial[name]
                            : returns.portfolio['_3Months'].initial.total += returns.portfolio['_3Months'].initial[name]

                        returns.portfolio['_3Months'].initial.total = Number((returns.portfolio['_3Months'].initial.total).toFixed(2))
                    }
                }
                if (!returns.portfolio['_3Months'].initial[name] && _3MonthsUnix < purchaseDateUnix) {
                    returns.portfolio['_3Months'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                    'total' in returns.portfolio['_3Months'].initial === false
                        ? returns.portfolio['_3Months'].initial.total = returns.portfolio['_3Months'].initial[name]
                        : returns.portfolio['_3Months'].initial.total += returns.portfolio['_3Months'].initial[name]

                    returns.portfolio['_3Months'].initial.total = Number((returns.portfolio['_3Months'].initial.total).toFixed(2))
                }

                'subtract' in returns.portfolio['_3Months'] === false
                    ? returns.portfolio['_3Months'].subtract = 0
                    : name in addMoney && `_${datetime}` in addMoney[name]
                        ? returns.portfolio['_3Months'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                        : returns.portfolio['_3Months'].subtract += 0

                if (i === allTickers.length - 1 && j === data.length - 1) {
                    returns.portfolio._3Months['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['_3Months'].subtract) / returns.portfolio._3Months.initial.total) - 1) * 100
                }

            }
            if (datetime >= _1MonthUnix) {
                tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                returns.tickers[name]['_1Month']['%'] = (((returns.tickers[name]['_1Month']['%'] + 1) * (1 + tickerReturn)) - 1)

                if (!returns.tickers[name]['_1Month']['startDate']) {
                    returns.tickers[name]['_1Month']['startDate'] = `${year}-${month}-${date}`
                    returns.tickers[name]['_1Month']['initialValue'] = tickerValue
                    returns.tickers[name]['_1Month']['%'] = 0

                    // _1month > purchaseDate && ===
                    if (_1MonthUnix >= purchaseDateUnix) {
                        returns.portfolio['_1Month'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                        'total' in returns.portfolio['_1Month'].initial === false
                            ? returns.portfolio['_1Month'].initial.total = returns.portfolio['_1Month'].initial[name]
                            : returns.portfolio['_1Month'].initial.total += returns.portfolio['_1Month'].initial[name]

                        returns.portfolio['_1Month'].initial.total = Number((returns.portfolio['_1Month'].initial.total).toFixed(2))
                    }
                }

                if (!returns.portfolio['_1Month'].initial[name] && _1MonthUnix < purchaseDateUnix) {
                    returns.portfolio['_1Month'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                    'total' in returns.portfolio['_1Month'].initial === false
                        ? returns.portfolio['_1Month'].initial.total = returns.portfolio['_1Month'].initial[name]
                        : returns.portfolio['_1Month'].initial.total += returns.portfolio['_1Month'].initial[name]

                    returns.portfolio['_1Month'].initial.total = Number((returns.portfolio['_1Month'].initial.total).toFixed(2))
                }

                'subtract' in returns.portfolio['_1Month'] === false
                    ? returns.portfolio['_1Month'].subtract = 0
                    : name in addMoney && `_${datetime}` in addMoney[name]
                        ? returns.portfolio['_1Month'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                        : returns.portfolio['_1Month'].subtract += 0

                if (i === allTickers.length - 1 && j === data.length - 1) {
                    returns.portfolio._1Month['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['_1Month'].subtract) / returns.portfolio._1Month.initial.total) - 1) * 100
                }

            }
            if (datetime >= YTDUnix) {
                tickerReturn = j === 0 ? 0 : ((close - data[j - 1].close) / data[j - 1].close)
                returns.tickers[name]['YTD']['%'] = (((returns.tickers[name]['YTD']['%'] + 1) * (1 + tickerReturn)) - 1)

                if (!returns.tickers[name]['YTD']['startDate']) {
                    returns.tickers[name]['YTD']['startDate'] = `${year}-${month}-${date}`
                    returns.tickers[name]['YTD']['initialValue'] = tickerValue
                    returns.tickers[name]['YTD']['%'] = 0

                    // YTD > purchaseDate && ===
                    if (YTDUnix >= purchaseDateUnix) {
                        returns.portfolio['YTD'].initial[name] = returns.graph[`_${datetime}`].shares[name].value

                        'total' in returns.portfolio['YTD'].initial === false
                            ? returns.portfolio['YTD'].initial.total = returns.portfolio['YTD'].initial[name]
                            : returns.portfolio['YTD'].initial.total += returns.portfolio['YTD'].initial[name]

                        returns.portfolio['YTD'].initial.total = Number((returns.portfolio['YTD'].initial.total).toFixed(2))
                    }
                }

                if (!returns.portfolio['YTD'].initial[name] && YTDUnix < purchaseDateUnix) {
                    returns.portfolio['YTD'].initial[name] = Number((purchasePrice * purchaseStocks).toFixed(2))

                    'total' in returns.portfolio['YTD'].initial === false
                        ? returns.portfolio['YTD'].initial.total = returns.portfolio['YTD'].initial[name]
                        : returns.portfolio['YTD'].initial.total += returns.portfolio['YTD'].initial[name]

                    returns.portfolio['YTD'].initial.total = Number((returns.portfolio['YTD'].initial.total).toFixed(2))
                }

                'subtract' in returns.portfolio['YTD'] === false
                    ? returns.portfolio['YTD'].subtract = 0
                    : name in addMoney && `_${datetime}` in addMoney[name]
                        ? returns.portfolio['YTD'].subtract += Number((addMoney[name][`_${datetime}`].purchaseStocks * addMoney[name][`_${datetime}`].purchasePrice).toFixed(2))
                        : returns.portfolio['YTD'].subtract += 0

                if (i === allTickers.length - 1 && j === data.length - 1) {
                    returns.portfolio.YTD['%'] = (((returns.graph[`_${datetime}`].total - returns.portfolio['YTD'].subtract) / returns.portfolio.YTD.initial.total) - 1) * 100
                }
            }


            if (j === data.length - 1) {
                //tickerReturn = ((close - data[j - 1].close) / data[j - 1].close) //in case 1DayReturn === last day
                returns.tickers[name]['_1Day']['%'] = (((returns.tickers[name]['_1Day']['%'] + 1) * (1 + tickerReturn)) - 1)
                returns.tickers[name]['_1Day']['startDate'] = `${year}-${month}-${date}`

                allTickers[i].returns = returns.tickers[name]
                allTickers[i].currentPrice = close
                allTickers[i].sharesFlow.in = addMoney[name] || false
                allTickers[i].sharesFlow.out = false

            }
            if (i === allTickers.length - 1 && j === data.length - 1) {
                returns.portfolio.sinceInception['%'] = ((returns.graph[`_${datetime}`].total / returns.portfolio.sinceInception.initial) - 1) * 100
                lastValue = returns.graph[`_${datetime}`].total
            }


        }


    }

    console.log(subtractSum)
    console.log(returns)
    console.log(allTickers)

    return {
        tickers: allTickers,
        returns: {
            portfolioReturns: returns.portfolio,
            graph: returns.graph
        },
        value: lastValue
    }

}