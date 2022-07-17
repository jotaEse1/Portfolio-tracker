import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Counter from './Counter';
import {store} from '../index'

describe('Counter component', () => {
    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        render(
            <Provider store={store}>
                <Counter />
            </Provider>
        )
    })

    test('should render', () => {
        const component = screen.getByText('Counter')
        expect(component).toBeInTheDocument()
    })

})
