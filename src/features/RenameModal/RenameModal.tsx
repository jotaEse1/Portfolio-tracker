import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdCheck } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { closeDashboard, deletePortfolio, renamePortfolio } from '../Dashboard/DashboardSlice';
import { openPortfolios } from '../Home/HomeSlice';
import { openLoader } from '../Loader/LoaderSlice';
import { closeMM, openMM, setMsg } from '../ModalMsg/ModalMsgSlice';
import './RenameModal.css'
import { closeRename } from './RenameModalSlice';

const RenameModal = () => {
    const [form, setForm] = useState({ name: '' })
    const { currentPortfolio } = useAppSelector(state => state.dashboard)
    const { optAction } = useAppSelector(state => state.renameModal)
    const dispatch = useAppDispatch()

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleRename = () => {
        if (!form.name) {
            dispatch(setMsg('You should provide a name'))
            dispatch(openMM())
            return setTimeout(() => dispatch(closeMM()), 3500)
        }

        dispatch(openLoader())
        dispatch(
            renamePortfolio({ id: currentPortfolio.id, name: form.name.trim() })
        )
        dispatch(closeRename())
    }

    const handleDelete = () => {
        dispatch(openLoader())
        dispatch(
            deletePortfolio({ id: currentPortfolio.id })
        )
        dispatch(closeRename())
        dispatch(closeDashboard())
        dispatch(openPortfolios())
    }

    const handleRetire = () => {

    }

    return (
        <div className='rename-modal'>
            <div className='rename-container'>
                {optAction === 'rename' &&
                    <>
                        <h3>Rename Portfolio</h3>
                        <input
                            type="text"
                            name='name'
                            value={form.name}
                            required
                            placeholder='new name....'
                            onChange={handleForm}
                        />
                        <button
                            type='button'
                            id='submit'
                            onClick={handleRename}
                        >
                            Submit
                        </button>
                    </>
                }
                {optAction === 'delete' &&
                    <>
                        <h3>You want to delete "{currentPortfolio.name}" portfolio?</h3>
                        <div className='delete-buttons'>
                            <button
                                type='button'
                                onClick={handleDelete}
                            >
                                <MdCheck />
                            </button>
                            <button
                                type='button'
                                onClick={() => dispatch(closeRename())}
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    </>
                }
                {optAction === 'retire' &&
                    <>
                    </>
                }
                <button
                    type='button'
                    id='close'
                    onClick={() => dispatch(closeRename())}
                >
                    <IoMdClose />
                </button>
            </div>
        </div>
    );
};

export default RenameModal;