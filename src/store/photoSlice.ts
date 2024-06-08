import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPhotos } from '../api/unsplash';

export interface Photo {
  id: string;
  url: string;
  description: string;
  author: string;
}

interface PhotoState {
  photos: Photo[];
  selectedPhoto: Photo | null;
  searchQuery: string;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  triggerSearch: boolean;
  errorMessage: string;
}

const initialState: PhotoState = {
  photos: [],
  selectedPhoto: null,
  searchQuery: '',
  page: 1,
  hasMore: true,
  isLoading: false,
  triggerSearch: false,
  errorMessage: '',
};

export const getPhotos = createAsyncThunk(
  'photos/getPhotos',
  async ({ query, page }: { query: string; page: number }, thunkAPI) => {
    const response = await fetchPhotos(query, page);
    return response;
  }
);

const photoSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    selectPhoto: (state, action: PayloadAction<Photo | null>) => {
      state.selectedPhoto = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1; // 當搜索查詢變更時，重置頁碼為1
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    triggerSearch: (state, action: PayloadAction<boolean>) => {
      state.triggerSearch = action.payload;
    },
    setNoResults: (state, action: PayloadAction<boolean>) => {
      state.hasMore = !action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPhotos.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPhotos.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.meta.arg.page === 1) {
        state.photos = action.payload;
      } else {
        state.photos = [...state.photos, ...action.payload];
      }
      state.hasMore = action.payload.length > 0;
    });
    builder.addCase(getPhotos.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message || 'Failed to fetch photos';
    });
  },
});

export const {
  selectPhoto,
  setSearchQuery,
  incrementPage,
  triggerSearch,
  setNoResults,
} = photoSlice.actions;

export default photoSlice.reducer;
