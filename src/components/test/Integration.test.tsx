import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore as configureReduxStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import Gallery from '../Gallery';
import photoReducer from '../../store/photoSlice';

const initialState = {
  photos: [],
  selectedPhoto: null,
  searchQuery: '',
  page: 1,
  hasMore: true,
  isLoading: false,
  triggerSearch: false,
  noResults: false,
  errorMessage: '', 
};

const mockPhotos = [
  {
    id: '1',
    urls: { small: 'https://example.com/photo1.jpg' },
    alt_description: 'Photo 1',
    user: { name: 'Author 1' },
  },
  {
    id: '2',
    urls: { small: 'https://example.com/photo2.jpg' },
    alt_description: 'Photo 2',
    user: { name: 'Author 2' },
  },
];

describe('Gallery Integration Test', () => {
  let mock: MockAdapter;
  let store: ReturnType<typeof configureReduxStore>;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  beforeEach(() => {
    store = configureReduxStore({
      reducer: {
        photos: photoReducer,
      },
      preloadedState: {
        photos: initialState,
      },
    });
  });

  it('should search and display photos', async () => {
    mock.onGet(/https:\/\/api.unsplash.com\/search\/photos.*/).reply(200, {
      results: mockPhotos,
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

    await waitFor(() => {
      const photo1 = screen.getByAltText('Photo 1');
      const photo2 = screen.getByAltText('Photo 2');
      expect(photo1).toBeInTheDocument();
      expect(photo2).toBeInTheDocument();
    });
  });
});
