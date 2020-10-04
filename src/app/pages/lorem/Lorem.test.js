import React from 'react';
import {render} from '@testing-library/react';
import Lorem from './Lorem';

test('renders learn react link', () => {
	const {getByText} = render(<Lorem/>);
	const linkElement = getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
