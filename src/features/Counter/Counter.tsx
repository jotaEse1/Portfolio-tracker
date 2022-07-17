import './Counter.css'
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { decrement, increment, incrementBy } from "./counterSlice";


const Counter = () => {
    const {counter} = useAppSelector(state => state.counter)
    const dispatch = useAppDispatch()

    return (
        <div className="counter-container" data-theme='dark' >
            <h1>Counter</h1>
            <p>{counter}</p>

            <button
                onClick={() => dispatch(increment())}
            >increment</button>
            <button
                onClick={() => dispatch(incrementBy(5))}
            >increment by 5</button>
            <button
                onClick={() => dispatch(decrement())}
            >decrement</button>
        </div>
    );
};

export default Counter;