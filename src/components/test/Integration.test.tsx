import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
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

const mockPhotos = [
  {
    id: '1',
    url: 'https://example.com/photo1.jpg',
    description: 'Photo 1',
    author: 'Author 1',
  },
  {
    id: '2',
    url: 'https://example.com/photo2.jpg',
    description: 'Photo 2',
    author: 'Author 2',
  },
];

describe('Gallery Integration Test', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  it('should search and display photos', async () => {
    mock.onGet('https://api.unsplash.com/search/photos').reply(200, {
      results: mockPhotos,
    });

    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <Gallery />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search Photo') as HTMLInputElement;
    const searchButton = screen.getByText('Search');

    console.log('Before search input change:', searchInput.value);
    fireEvent.change(searchInput, { target: { value: 'cats' } });
    console.log('After search input change:', searchInput.value);

    fireEvent.click(searchButton);
    console.log('Search button clicked');


  });
});
