import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import './Colors.css'
import { closeColors, openColors, setColor } from './ColorsSlice';
import { IoMdClose } from 'react-icons/io';

const Colors = () => {
    const { colors, color, isColorsOpen } = useAppSelector(state => state.colors)
    const dispatch = useAppDispatch()

    return (
        <>
            {!isColorsOpen ? (
                <div className='colors-container-close'>
                    <div
                        className='one-color-door'
                        style={{ background: color.hex }}
                        onClick={() => dispatch(openColors())}
                    ></div>
                </div>
            ) : (
                <div className='colors-container-open'>
                    <div
                        className='one-color-door-2'
                        onClick={() => dispatch(closeColors())}
                    >
                        <IoMdClose />
                    </div>
                    <div className='all-colors'>
                        {colors.map(one =>
                            <div key={one.hex}>
                                <div
                                    className={color.name === one.name ? 'one-color-f selected' : 'one-color-f'}
                                    style={{ background: one.back }}
                                    onClick={() => dispatch(setColor({ name: one.name, hex: one.hex }))}
                                ></div>
                                <div
                                    className={color.name === one.name ? 'one-color-s selected' : 'one-color-s'}
                                    style={{ background: one.hex }}
                                    onClick={() => dispatch(setColor({ name: one.name, hex: one.hex }))}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Colors;