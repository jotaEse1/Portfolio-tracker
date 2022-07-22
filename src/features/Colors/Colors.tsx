import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import './Colors.css'
import { closeColors, openColors, setColor } from './ColorsSlice';
import { IoMdClose } from 'react-icons/io';

const Colors = () => {
    const { colors, color, isColorsOpen } = useAppSelector(state => state.colors)
    const dispatch = useAppDispatch()

    const setTheme = (colorObj: {name: string; hex: string; back: string;}) => {
        const root = document.querySelector(':root') as HTMLDivElement;

        root.style.setProperty('--scrollBar-back', colorObj.back);
        root.style.setProperty('--scrollBar-color', colorObj.hex);
        dispatch(setColor(colorObj))
        localStorage.setItem('theme-color', JSON.stringify(colorObj))
    }

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
                            <div 
                                key={one.hex}
                                onClick={() => setTheme(one)}
                                className={color.name === one.name ? 'selected' : 'undefined'}
                            >
                                <div className='one-color-f' style={{ background: one.back }}></div>
                                <div className='one-color-s' style={{ background: one.hex }}></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Colors;