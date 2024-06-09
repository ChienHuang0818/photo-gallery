import configureMockStore from 'redux-mock-store';
import { configureStore } from '@reduxjs/toolkit';
import photoReducer from './../../store/photoSlice';


const mockStore = configureMockStore([]);

describe('Redux Store', () => {
  it('should configure the store with photoReducer', () => {

    const store = configureStore({
      reducer: {
        photos: photoReducer,
      },
    });

    const state = store.getState();
    expect(state).toHaveProperty('photos');
  });

  it('should dispatch actions and update state correctly', () => {
    const store = configureStore({
      reducer: {
        photos: photoReducer,
      },
    });

    store.dispatch({ type: 'photos/setSearchQuery', payload: 'cats' });

    const state = store.getState();
    expect(state.photos.searchQuery).toBe('cats');
  });

  it('should create a mock store with initial state', () => {
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

    const store = mockStore(initialState);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
});
