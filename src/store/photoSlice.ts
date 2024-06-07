import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPhotos } from '../api/unsplash';

export interface Photo {
  id: string;
  url: string;
  author: string;
  description: string;
}

interface PhotoState {
  photos: Photo[];
  selectedPhoto: Photo | null;
  searchQuery: string;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  triggerSearch: boolean;
  noResults: boolean;
}

const initialState: PhotoState = {
  photos: [],
  selectedPhoto: null,
  searchQuery: '',
  page: 1,
  hasMore: true,
  isLoading: false,
  triggerSearch: false,
  noResults: false,
};

export const getPhotos = createAsyncThunk('photos/getPhotos', async ({ query, page }: { query: string, page: number }) => {
  const photos = await fetchPhotos(query, page);
  return photos.map((photo: any) => ({
    id: photo.id,
    url: photo.urls.regular,
    author: photo.user.name,
    description: photo.description || 'No description',
  }));
});

const photoSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    selectPhoto(state, action: PayloadAction<Photo | null>) {
      state.selectedPhoto = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1;
      state.photos = [];
      state.hasMore = true;
    },
    incrementPage(state) {
      state.page += 1;
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
    triggerSearch(state, action: PayloadAction<boolean>) {
      state.triggerSearch = action.payload;
    },
    setNoResults(state, action: PayloadAction<boolean>) {
      state.noResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPhotos.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPhotos.fulfilled, (state, action) => {
      state.isLoading = false;
      state.noResults = action.payload.length === 0;
      if (state.page === 1) {
        state.photos = action.payload;
      } else {
        state.photos = [...state.photos, ...action.payload];
      }
      state.hasMore = action.payload.length > 0;
    });
  },
});

export const { selectPhoto, setSearchQuery, incrementPage, setHasMore, triggerSearch, setNoResults } = photoSlice.actions;

export default photoSlice.reducer;
