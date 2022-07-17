import { useAppSelector } from '../../hooks/hooks';
import './ModalMsg.css'

const ModalMsg = () => {
    const {msg} = useAppSelector(state => state.modalMsg)

    return (
        <div className='modal-msg-container'>
            <p>{msg}</p>
        </div>
    );
};

export default ModalMsg;