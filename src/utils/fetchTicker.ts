import { Fundamental, TickerDescriptionAPI } from "../types/types";

interface Detail {
    assetType: string;
    cusip: string;
    description: string;
    exchange: string;
    symbol: string;
}

export const fetchTicker = (ticker: string) : Promise<[Fundamental, Detail]> => {
    let url = `https://${process.env.REACT_APP_API_PROVIDER}/v1/instruments?apikey=${process.env.REACT_APP_API_KEY}&symbol=${ticker}&projection=fundamental`;


    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then((response: { [key: string]: TickerDescriptionAPI }) => {
                console.log(response)

                if (!response[ticker]) {
                    const resp = [] as unknown as [Fundamental, Detail]
                    return resolve(resp)
                }

                const { fundamental, ...detail } = response[ticker]

                return resolve([fundamental, detail])
            })
            .catch(err => { 
                reject(new Error(err))
            })

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