import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { getPortfolios, setCurrentPort } from '../Dashboard/DashboardSlice';
import { openPM } from '../PortfolioModal/PortfolioModalSlice';
import { closeBar } from '../SideBar/SideBarSlice';
import { closeHome, openPortfolios } from './HomeSlice';
import './Home.css'
import { openTicker } from '../Ticker/TickerSlice';

const Home = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getPortfolios('1'))
    }, [])

    return (
        <div className='home-container'>
            <div className='home-content'>
                <h1>Welcome</h1>
                <div className='home-sections'>
                    <h4 
                        onClick={() => {
                            dispatch(closeHome())
                            dispatch(openPortfolios())
                        }}
                    >
                        Portfolios
                    </h4>
                    <h4
                        onClick={() => {
                            dispatch(closeHome())
                            dispatch(openTicker())
                        }}
                    >Tickers</h4>
                    <h4>Scanner</h4>
                </div>
            </div>
        </div>
    );
};

export default Home;