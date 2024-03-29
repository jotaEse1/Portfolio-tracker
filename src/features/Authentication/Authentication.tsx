import { useEffect, useLayoutEffect, useState } from 'react';
import { URLS } from '../../enums/enums';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setColor } from '../Colors/ColorsSlice';
import Loader from '../Loader/Loader';
import LogIn from '../LogIn/LogIn';
import ModalMsg from '../ModalMsg/ModalMsg';
import SignIn from '../SignIn/SignIn';
import './Authentication.css'
import { authenticateUser, denyAccess, setUser } from './AuthenticationSlice';

const Authentication = () => {
  const [loading, setLoading] = useState(true);
  const { isLoginOpen } = useAppSelector(state => state.authentication);
  const { isOpenMM } = useAppSelector(state => state.modalMsg);
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    const themeColor = localStorage.getItem('theme-color'),
      root = document.querySelector(':root') as HTMLDivElement;

    if (!themeColor) {
      localStorage.setItem('theme-color', JSON.stringify({ name: 'green', hex: '#39FF14', back: '#121212' }))
      root.style.setProperty('--scrollBar-back', '#121212');
      root.style.setProperty('--scrollBar-color', '#39FF14');

    } else {
      const objTheme = JSON.parse(themeColor);

      dispatch(setColor(objTheme))
      root.style.setProperty('--scrollBar-back', objTheme.back);
      root.style.setProperty('--scrollBar-color', objTheme.hex);
    }
  }, [])

  useEffect(() => {
    const options: RequestInit = {
      method: 'POST',
      credentials: 'include', // Needed to include the cookie
      headers: {
        'Content-Type': 'application/json'
      }
    };

    fetch(URLS.REFRESH, options)
      .then(res => res.json())
      .then(res => {
        const { payload } = res;

        if (payload.status === 404) {
          dispatch(denyAccess())
          return setLoading(false)
        }

        dispatch(setUser(payload.accessToken))
        dispatch(authenticateUser())
        return setLoading(false)
      })
      .catch(err => {
        console.log(err)
        dispatch(denyAccess())
        setLoading(false)
      })

  }, [])

  if (loading) return (
    <div className='loader-container'>
      <Loader />
    </div>
  )

  return (
    <div className='authentication-container'>
      {isOpenMM && <ModalMsg />}
      <div className='authentication'></div>
      {isLoginOpen ? <LogIn /> : <SignIn />}
    </div>
  );
};

export default Authentication;