import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from '../Loader'; 

test('renders loading indicator', () => {
	render(<Loader />);
	const loaderContainer = screen.getByTestId('loader-container');
	expect(loaderContainer).toBeInTheDocument();
  
	const loaderIcon = screen.getByTestId('loader-icon');
	expect(loaderIcon).toBeInTheDocument();
  });
