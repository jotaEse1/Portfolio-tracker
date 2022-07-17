export interface ShareFlow {
    [key: string]: { //date unix _18124389
        purchaseDate: string,
        purchaseDateUnix: number,
        purchasePrice: number,
        purchaseStocks: number,
    },
    total: number,
    totalIn: number
}

export interface TickerAPI {
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    datetime: number,
}

export interface TickerDescriptionAPI {
    assetType: string,
    cusip: string,
    description: string,
    exchange: string,
    fundamental: {
        beta: number,
        bookValuePerShare: number,
        currentRatio: number,
        divGrowthRate3Year: number,
        dividendAmount: number,
        dividendDate: string,
        dividendPayAmount: number,
        dividendPayDate: string,
        dividendYield: number,
        epsChange: number,
        epsChangePercentTTM: number,
        epsChangeYear: number,
        epsTTM: number,
        grossMarginMRQ: number,
        grossMarginTTM: number,
        high52: number,
        interestCoverage: number,
        low52: number,
        ltDebtToEquity: number,
        marketCap: number,
        marketCapFloat: number,
        netProfitMarginMRQ: number,
        netProfitMarginTTM: number,
        operatingMarginMRQ: number,
        operatingMarginTTM: number,
        pbRatio: number,
        pcfRatio: number,
        peRatio: number,
        pegRatio: number,
        prRatio: number,
        quickRatio: number,
        returnOnAssets: number,
        returnOnEquity: number,
        returnOnInvestment: number,
        revChangeIn: number,
        revChangeTTM: number,
        revChangeYear: number,
        sharesOutstanding: number,
        shortIntDayToCover: number,
        shortIntToFloat: number,
        symbol: string,
        totalDebtToCapital: number,
        totalDebtToEquity: number,
        vol1DayAvg: number,
        vol3MonthAvg: number,
        vol10DayAvg: number
    },
    symbol: string
}

export interface Fundamental {
    beta: number,
    bookValuePerShare: number,
    currentRatio: number,
    divGrowthRate3Year: number,
    dividendAmount: number,
    dividendDate: string,
    dividendPayAmount: number,
    dividendPayDate: string,
    dividendYield: number,
    epsChange: number,
    epsChangePercentTTM: number,
    epsChangeYear: number,
    epsTTM: number,
    grossMarginMRQ: number,
    grossMarginTTM: number,
    high52: number,
    interestCoverage: number,
    low52: number,
    ltDebtToEquity: number,
    marketCap: number,
    marketCapFloat: number,
    netProfitMarginMRQ: number,
    netProfitMarginTTM: number,
    operatingMarginMRQ: number,
    operatingMarginTTM: number,
    pbRatio: number,
    pcfRatio: number,
    peRatio: number,
    pegRatio: number,
    prRatio: number,
    quickRatio: number,
    returnOnAssets: number,
    returnOnEquity: number,
    returnOnInvestment: number,
    revChangeIn: number,
    revChangeTTM: number,
    revChangeYear: number,
    sharesOutstanding: number,
    shortIntDayToCover: number,
    shortIntToFloat: number,
    symbol: string,
    totalDebtToCapital: number,
    totalDebtToEquity: number,
    vol1DayAvg: number,
    vol3MonthAvg: number,
    vol10DayAvg: number
}

export interface Detail {
    assetType: string;
    cusip: string;
    description: string;
    exchange: string;
    symbol: string;
}

export interface TickerReturns {
    _1Day: {
        '%': number,
        startDate: string,
        initialValue: number
    },
    _1Month: {
        '%': number,
        startDate: string,
        initialValue: number
    },
    _3Months: {
        '%': number,
        startDate: string,
        initialValue: number
    },
    _6Months: {
        '%': number,
        startDate: string,
        initialValue: number
    },
    YTD: {
        '%': number,
        startDate: string,
        initialValue: number
    }
}

export interface GraphReturns {
    shares: {
        [key: string]: {
            '%': number,
            value: number,
            '%Acumulated': number
        }
    },
    total: number,
    'total_%': number,
    'total_%String': string,
    date: string,
    percentage: number,
    percentageString: string,
    capital: number,
    capital_string: string
}

export interface PortfolioReturns {
    _1Month: {
        initial: {
            [key: string]: number,
            total: number
        },
        subtract: number,
        '%': number
    },
    _3Months: {
        initial: {
            [key: string]: number,
            total: number
        },
        subtract: number,
        '%': number
    },
    _6Months: {
        initial: {
            [key: string]: number,
            total: number
        },
        subtract: number,
        '%': number
    },
    YTD: {
        initial: {
            [key: string]: number,
            total: number
        },
        subtract: number,
        '%': number
    },
    sinceInception: {
        initial: number,
        '%': number
    }
}

export interface TickerDescription {
    id: string,
    name: string,
    purchaseDateUnix: number,
    purchaseDate: string,
    purchasePrice: number
    purchaseStocks: number
    data: TickerAPI[],
    returns: TickerReturns,
    sharesFlow: {
        in: ShareFlow | false,
        out: ShareFlow | false
    },
    allocation: number,
    currentPrice: number
}

export interface Portfolio {
    id: number,
    name: string,
    id_user: number,
    last_update: string,
    value: number,
    tickers: TickerDescription[],
    returns: {
        portfolioReturns: PortfolioReturns,
        graph: {
            [key: string]: GraphReturns
        }
    }
}




export interface TickerRow {
    id: string,
    name: string,
    purchaseDate: string,
    purchaseDateUnix: number,
    purchasePrice: number,
    purchaseStocks: number
}

export interface TickerError {
    name: string,
    purchaseDate: string,
    purchaseDateUnix: number,
    purchasePrice: number,
    purchaseStocks: number,
    value: number
}

export interface TickerSend {
    name: string,
    purchaseDate: string,
    purchaseDateUnix: number,
    purchasePrice: number,
    purchaseStocks: number,
    data: TickerAPI[],
    returns: TickerReturns | {},
    allocation: number,
    currentPrice: number,
    sharesFlow: {
        in: ShareFlow | false,
        out: ShareFlow | false
    }
}

export interface PortfolioSend {
    idUser: number,
    name: string,
    lastUpdate: string,
    value: number,
    tickers: TickerSend[],
    returns: {}
}

export interface AddMoney {
    [key: string]: { //tickername 
        [key: string]: { //date unix _18124389
            purchaseDate: string,
            purchaseDateUnix: number,
            purchasePrice: number,
            purchaseStocks: number,
        },
        total: number,
        totalIn: number
    }
}

export interface HoldingsSend {
    idUser: number,
    idPortfolio: number,
    name: string,
    lastUpdate: string,
    value: number,
    tickers: TickerSend[],
    returns: {},
    ui: string
}

export interface UpdatePortfolio {
    idUser: number,
    idPortfolio: number,
    name: string,
    lastUpdate: string,
    value: number,
    tickers: TickerSend[],
    returns: {}
}

export interface TickerGraph {
    minPrice: number,
    maxPrice: number,
    minDate: number,
    maxDate: number,
    chunkCandles: TickerAPI[][],
    candles: TickerAPI[]
}




