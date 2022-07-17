import { Detail, Fundamental, TickerDescriptionAPI } from "../types/types";

export const fetchTicker = (ticker: string) : Promise<[Fundamental, Detail]> => {
    let url = `https://api.tdameritrade.com/v1/instruments?apikey=ZEXA1X6AL3OSMFJYI7TECJNYSB4W3IHV&symbol=${ticker}&projection=fundamental`;


    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then((response: { [key: string]: TickerDescriptionAPI }) => {
                //response --> {} or {tickername: {}}
                console.log(response)

                if (!response[ticker]) {
                    return reject([])
                }

                const { fundamental, ...detail } = response[ticker]

                return resolve([fundamental, detail])
            })
            .catch(err => { throw new Error(err) })

    })
}

/* 
    general = {
        sharesOutstanding,
        marketCap,
        beta,
        vol3MonthAvg,
        high52,
        low52
    }

    quality = {
        grossMarginTTM,
        returnOnEquity,
        returnOnAssets,
    }

    value = {
        peRatio,
        pegRatio,
        pbRatio,
        epsTTM,
        epsChangePercentTTM,
        bookValuePerShare,
        totalDebtToEquity"
    }


    dividends = {
        "dividendAmount"
        "dividendYield"
        "dividendDate"
        "divGrowthRate3Year"
        "dividendPayAmount"
        "dividendPayDate"
    }

    fundamental = {
        netProfitMarginTTM"
        "operatingMarginTTM"
        "quickRatio": 0.88402,
        "currentRatio": 0.92684,
        "interestCoverage": 0.0,
        "totalDebtToCapital": 64.03085,
        "shortIntToFloat": 0.0,
        "shortIntDayToCover": 0.0,
    }

*/