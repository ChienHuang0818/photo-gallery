import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Gallery from '../Gallery';

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

test('displays error message when search input is empty', () => {
  const store = mockStore(initialState);
  render(
    <Provider store={store}>
      <Gallery />
    </Provider>
  );

  const searchInput = screen.getByPlaceholderText('Search Photo') as HTMLInputElement;
  const searchButton = screen.getByText('Search');

  fireEvent.change(searchInput, { target: { value: ' ' } });
  fireEvent.click(searchButton);

  const errorMessage = screen.getByText('Please enter a keyword to search');
  expect(errorMessage).toBeInTheDocument();
});

test('displays "No results" when search returns no results', () => {
  const store = mockStore({
    ...initialState,
    photos: {
      ...initialState.photos,
      searchQuery: 'nonexistent',
      errorMessage: 'No results',
      photos: []
    },
  });
  render(
    <Provider store={store}>
      <Gallery />
    </Provider>
  );

  const searchInput = screen.getByPlaceholderText('Search Photo') as HTMLInputElement;
  const searchButton = screen.getByText('Search');

  fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
  fireEvent.click(searchButton);

  const noResultsMessage = screen.getByText('No results');
  expect(noResultsMessage).toBeInTheDocument();
});

test('renders search results when search button is clicked', () => {
  const store = mockStore({
    ...initialState,
    photos: {
      ...initialState.photos,
      searchQuery: 'cats',
      photos: [{ id: '1', url: 'https://example.com/photo1', description: 'Photo 1' }],
    },
  });
  render(
    <Provider store={store}>
      <Gallery />
    </Provider>
  );

  const searchInput = screen.getByPlaceholderText('Search Photo') as HTMLInputElement;
  const searchButton = screen.getByText('Search');

  fireEvent.change(searchInput, { target: { value: 'cats' } });
  fireEvent.click(searchButton);

  const photo = screen.getByAltText('Photo 1');
  expect(photo).toBeInTheDocument();
});
