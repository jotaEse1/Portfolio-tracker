import { ShareFlow, TickerError, TickerRow, TickerSend } from "../types/types";
import { dates } from "./dates";

interface Error {
    response: {
        status: 400,
        payload: TickerError
    }

}

interface Success {
    response: {
        status: 200,
        payload: TickerSend
    } | {
        status: 300,
        payload: TickerError
    } | {
        status: 100,
        payload: {
            name: string,
            purchaseDate: string,
            purchaseDateUnix: number,
            purchasePrice: number,
            purchaseStocks: number,
        }
    }
}

export const fetchDataTickers = (ticker: TickerRow, portfolioValue: number, alreadyFetched: {[key: string]: true}): Promise<Error | Success> => {
    let { name, purchaseDateUnix, purchasePrice, purchaseStocks, purchaseDate } = ticker,
        {year, month, date, day} = dates(Date.now()),
        todayUnix = new Date(`${year}-${month}-${date} 02:00:00`).getTime(),
        datePurchase = dates(purchaseDateUnix),
        _1dayUnix = 86400000,
        _6MonthsUnix = todayUnix - (_1dayUnix * 180),
        YTDUnix = new Date(`${year - 1}-12-31 02:00:00`).getTime(),
        startDate = 0; // 

    return new Promise((resolve, reject) => {
        if(name in alreadyFetched){
            return resolve({
                response: {
                    status: 100,
                    payload: {
                        name,
                        purchaseDate,
                        purchaseDateUnix,
                        purchasePrice,
                        purchaseStocks
                    }
                }
            })
        }
        if (datePurchase.day === 'Sunday' || datePurchase.day === 'Saturday') {
            return resolve({
                response: {
                    status: 400,
                    payload: {
                        ...ticker,
                        value: Number((purchasePrice * purchaseStocks).toFixed(2))
                    }
                }
            })
        }
        if (day === 'Saturday') {
            //24 hours unix format ---> 86400000
            todayUnix = Date.now() + (2 * _1dayUnix)
        }
        if (day === 'Sunday') {
            todayUnix = Date.now() + _1dayUnix
        }
        if(purchaseDateUnix <= _6MonthsUnix && purchaseDateUnix <= YTDUnix) startDate = purchaseDateUnix
        if(_6MonthsUnix <= purchaseDateUnix  &&  _6MonthsUnix <= YTDUnix) startDate = _6MonthsUnix
        if(YTDUnix <= purchaseDateUnix  && YTDUnix <= _6MonthsUnix) startDate = YTDUnix
        

        //const url = `https://api.tdameritrade.com/v1/marketdata/${name}/pricehistory?apikey=ZEXA1X6AL3OSMFJYI7TECJNYSB4W3IHV&periodType=month&frequencyType=daily&endDate=1653037200000&startDate=1619902800000&needExtendedHoursData=false`
        const url = `https://api.tdameritrade.com/v1/marketdata/${name}/pricehistory?apikey=ZEXA1X6AL3OSMFJYI7TECJNYSB4W3IHV&periodType=month&frequencyType=daily&endDate=${todayUnix}&startDate=${startDate}&needExtendedHoursData=false`


        fetch(url)
            .then(res => res.json())
            .then(res => {
                const { candles, empty, error } = res
                //const start = performance.now()

                // setTimeout(() => {
                //   const end = performance.now()
                //   singleDuration.push({symbol, time: end - start})
                //   resolve({
                //     ticker: symbol,
                //     data: candles
                //   })
                // }, 1000);

                if (error) {
                    return reject(new Error('Bad request'))
                    //shows in components catch
                }
                if (empty) {
                    return resolve({
                        response: {
                            status: 300,
                            payload: {
                                ...ticker,
                                value: Number((purchasePrice * purchaseStocks).toFixed(2))
                            }
                        }
                    })
                }

                resolve({
                    response: {
                        status: 200,
                        payload: { 
                            ...ticker, 
                            data: candles, 
                            returns: {},
                            allocation: Number((((purchasePrice * purchaseStocks) / portfolioValue) * 100).toFixed(2)),
                            currentPrice: 0,
                            sharesFlow: {
                                in: {} as ShareFlow,
                                out: {} as ShareFlow
                            }
                        }
                    }
                })
                //const end = performance.now()
                //singleDuration.push({ symbol, time: end - start })


            })
            .catch(() => reject(new Error()))
    })
}