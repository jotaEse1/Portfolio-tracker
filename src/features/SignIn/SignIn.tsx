import { useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { openLogIn, signIn } from '../Authentication/AuthenticationSlice';
import { closeLoader } from '../Loader/LoaderSlice';
import { closeMM, openMM, setMsg } from '../ModalMsg/ModalMsgSlice';
import './SignIn.css'

const SignIn = () => {
    const [form, setForm] = useState({username: '', email: '', password: ''})
    const dispatch = useAppDispatch()
    
    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!form.email || !form.password || !form.username) {
            dispatch(closeLoader())
            dispatch(setMsg('You should complete all fields.'))
            dispatch(openMM())
            return setTimeout(() => dispatch(closeMM()), 3500)
        }

        dispatch(signIn(form))
    }

    return (
        <div className='signIn-container'>
            <h2>Sign In</h2>
            <form 
                className='signIn-inputs-container'
                onSubmit={handleSignIn}
            >
                <label htmlFor="username">Username</label>
                <input type="text" name='username' value={form.username} required onChange={handleForm} autoComplete='off'/>
                <label htmlFor="username">Email</label>
                <input type="email" name='email' value={form.email} required onChange={handleForm} autoComplete='off'/>
                <label htmlFor="username">Password</label>
                <input type="password" name='password' value={form.password} required onChange={handleForm} autoComplete='off'/>
                <span
                    onClick={() => dispatch(openLogIn())}
                >Already a user?</span>
                <button>Sign in</button>
            </form>
        </div>
    );
};

export default SignIn;