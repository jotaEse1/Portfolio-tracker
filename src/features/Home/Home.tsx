import React, { useEffect, useLayoutEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { getPortfolios, setCurrentPort } from '../Dashboard/DashboardSlice';
import { openPM } from '../PortfolioModal/PortfolioModalSlice';
import { closeBar } from '../SideBar/SideBarSlice';
import { closeHome, openPortfolios } from './HomeSlice';
import './Home.css'
import { openTicker } from '../Ticker/TickerSlice';
import { setColor } from '../Colors/ColorsSlice';

const Home = () => {
    const {user} = useAppSelector(state => state.authentication)
    const dispatch = useAppDispatch()

    // useLayoutEffect(() => {
    //     const themeColor = localStorage.getItem('theme-color'),
    //         homeContainer = document.querySelector('.home-container') as HTMLDivElement;

    //     if (!themeColor) {
    //         const homeBack = `url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27207%27 height=%27207%27 viewBox=%270 0 800 800%27%3E%3Cg fill=%27none%27 stroke=%27%2339FF14%27 stroke-width=%271%27%3E%3Cpath d=%27M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63%27/%3E%3Cpath d=%27M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764%27/%3E%3Cpath d=%27M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880%27/%3E%3Cpath d=%27M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382%27/%3E%3Cpath d=%27M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269%27/%3E%3C/g%3E%3Cg fill=%27%2339FF14%27%3E%3Ccircle cx=%27769%27 cy=%27229%27 r=%279%27/%3E%3Ccircle cx=%27539%27 cy=%27269%27 r=%279%27/%3E%3Ccircle cx=%27603%27 cy=%27493%27 r=%279%27/%3E%3Ccircle cx=%27731%27 cy=%27737%27 r=%279%27/%3E%3Ccircle cx=%27520%27 cy=%27660%27 r=%279%27/%3E%3Ccircle cx=%27309%27 cy=%27538%27 r=%279%27/%3E%3Ccircle cx=%27295%27 cy=%27764%27 r=%279%27/%3E%3Ccircle cx=%2740%27 cy=%27599%27 r=%279%27/%3E%3Ccircle cx=%27102%27 cy=%27382%27 r=%279%27/%3E%3Ccircle cx=%27127%27 cy=%2780%27 r=%279%27/%3E%3Ccircle cx=%27370%27 cy=%27105%27 r=%279%27/%3E%3Ccircle cx=%27578%27 cy=%2742%27 r=%279%27/%3E%3Ccircle cx=%27237%27 cy=%27261%27 r=%279%27/%3E%3Ccircle cx=%27390%27 cy=%27382%27 r=%279%27/%3E%3C/g%3E%3C/svg%3E")`;

    //         homeContainer.style.setProperty('background', '#121212')
    //         homeContainer.style.setProperty('background-image', homeBack)

    //     } else {
    //         const objTheme = JSON.parse(themeColor),
    //             homeBack = `url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27207%27 height=%27207%27 viewBox=%270 0 800 800%27%3E%3Cg fill=%27none%27 stroke=%27%23${objTheme.hex.slice(1)}50%27 stroke-width=%271%27%3E%3Cpath d=%27M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63%27/%3E%3Cpath d=%27M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764%27/%3E%3Cpath d=%27M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880%27/%3E%3Cpath d=%27M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382%27/%3E%3Cpath d=%27M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269%27/%3E%3C/g%3E%3Cg fill=%27%23${objTheme.hex.slice(1)}%27%3E%3Ccircle cx=%27769%27 cy=%27229%27 r=%279%27/%3E%3Ccircle cx=%27539%27 cy=%27269%27 r=%279%27/%3E%3Ccircle cx=%27603%27 cy=%27493%27 r=%279%27/%3E%3Ccircle cx=%27731%27 cy=%27737%27 r=%279%27/%3E%3Ccircle cx=%27520%27 cy=%27660%27 r=%279%27/%3E%3Ccircle cx=%27309%27 cy=%27538%27 r=%279%27/%3E%3Ccircle cx=%27295%27 cy=%27764%27 r=%279%27/%3E%3Ccircle cx=%2740%27 cy=%27599%27 r=%279%27/%3E%3Ccircle cx=%27102%27 cy=%27382%27 r=%279%27/%3E%3Ccircle cx=%27127%27 cy=%2780%27 r=%279%27/%3E%3Ccircle cx=%27370%27 cy=%27105%27 r=%279%27/%3E%3Ccircle cx=%27578%27 cy=%2742%27 r=%279%27/%3E%3Ccircle cx=%27237%27 cy=%27261%27 r=%279%27/%3E%3Ccircle cx=%27390%27 cy=%27382%27 r=%279%27/%3E%3C/g%3E%3C/svg%3E")`;

    //         dispatch(setColor(objTheme))
    //         homeContainer.style.setProperty('background', objTheme.back)
    //         homeContainer.style.setProperty('background-image', homeBack)

    //     }

    // }, [])

    useEffect(() => {
        dispatch(getPortfolios(user))
    }, [])

    return (
        <div className='home-container'>
            <div className='home-content'>
                <h1>Welcome to Porty</h1>
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
                </div>
            </div>
        </div>
    );
};

export default Home;