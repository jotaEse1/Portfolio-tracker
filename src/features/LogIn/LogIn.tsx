import { useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { logIn, openSignIn } from '../Authentication/AuthenticationSlice';
import { closeLoader } from '../Loader/LoaderSlice';
import { closeMM, openMM, setMsg } from '../ModalMsg/ModalMsgSlice';
import './LogIn.css'

const LogIn = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const dispatch = useAppDispatch()

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleLogIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!form.email || !form.password) {
            dispatch(closeLoader())
            dispatch(setMsg('You should complete all fields.'))
            dispatch(openMM())
            return setTimeout(() => dispatch(closeMM()), 3500)
        }

        dispatch(logIn(form))
    }

    return (
        <div className='logIn-container'>
            <h2>Log In</h2>
            <form
                className='logIn-inputs-container'
                onSubmit={handleLogIn}
            >
                <label htmlFor="username">Email</label>
                <input type="email" name='email' value={form.email} required onChange={handleForm} autoComplete='off' />
                <label htmlFor="username">Password</label>
                <input type="password" name='password' value={form.password} required onChange={handleForm} autoComplete='off' />
                <span
                    onClick={() => dispatch(openSignIn())}
                >You don't an account?</span>
                <button>Log in</button>
            </form>
        </div>
    );
};

export default LogIn;