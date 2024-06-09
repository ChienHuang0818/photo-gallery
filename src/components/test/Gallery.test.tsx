import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Gallery from '../Gallery'; // 根据实际路径调整导入路径

const mockStore = configureStore([]);
const initialState = {
  photos: {
    photos: [],
    selectedPhoto: null,
    searchQuery: '',
    page: 1,
    hasMore: true,
    isLoading: false,
    errorMessage: '',
  },
};

test('renders search bar', () => {
  const store = mockStore(initialState);
  render(
    <Provider store={store}>
      <Gallery />
    </Provider>
  );

  const searchInput = screen.getByPlaceholderText('Search Photo');
  expect(searchInput).toBeInTheDocument();
});

test('renders loader when loading', () => {
  const store = mockStore({
    ...initialState,
    photos: {
      ...initialState.photos,
      isLoading: true,
    },
  });
  render(
    <Provider store={store}>
      <Gallery />
    </Provider>
  );

  const loader = screen.getByTestId('loader-container');
  expect(loader).toBeInTheDocument();
});


test('handles empty search input', () => {
	const store = mockStore(initialState);
	render(
	  <Provider store={store}>
		<Gallery />
	  </Provider>
	);
  
	const searchInput = screen.getByPlaceholderText('Search Photo') as HTMLInputElement;
	const searchButton = screen.getByText('Search');
  
	fireEvent.change(searchInput, { target: { value: '' } });
	fireEvent.click(searchButton);
  
	const errorMessage = screen.getByText('Please enter a keyword to search');
	expect(errorMessage).toBeInTheDocument();
  });


test('submits search query', () => {
  const store = mockStore(initialState);
  render(
    <Provider store={store}>
      <Gallery />
    </Provider>
  );

  const searchInput = screen.getByPlaceholderText('Search Photo') as HTMLInputElement;
  const searchButton = screen.getByText('Search');

  fireEvent.change(searchInput, { target: { value: 'cats' } });
  fireEvent.click(searchButton);

  // 确保正确触发 action
  expect(store.getActions()).toContainEqual({
    type: 'photos/setSearchQuery',
    payload: 'cats',
  });
});
