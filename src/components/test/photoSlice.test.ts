import photoReducer, { selectPhoto, setSearchQuery, incrementPage, triggerSearch, setNoResults } from '../../store/photoSlice';

describe('photoSlice', () => {
  interface Photo {
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
    triggerSearch: boolean; // 新增
    noResults: boolean; // 新增
    errorMessage?: string;
  }

  const initialState: PhotoState = {
    photos: [],
    selectedPhoto: null,
    searchQuery: '',
    page: 1,
    hasMore: true,
    isLoading: false,
    triggerSearch: false, // 新增
    noResults: false, // 新增
  };

  it('should handle initial state', () => {
    expect(photoReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle selectPhoto', () => {
    const actual = photoReducer(initialState, selectPhoto({ id: '1', url: 'test-url', description: 'test', author: 'test-author' }));
    expect(actual.selectedPhoto).toEqual({ id: '1', url: 'test-url', description: 'test', author: 'test-author' });
  });

  it('should handle setSearchQuery', () => {
    const actual = photoReducer(initialState, setSearchQuery('cats'));
    expect(actual.searchQuery).toEqual('cats');
    expect(actual.page).toEqual(1);
  });

  it('should handle incrementPage', () => {
    const actual = photoReducer(initialState, incrementPage());
    expect(actual.page).toEqual(2);
  });

  it('should handle triggerSearch', () => {
    const actual = photoReducer(initialState, triggerSearch(true));
    expect(actual.triggerSearch).toEqual(true);
  });

  it('should handle setNoResults', () => {
    const actual = photoReducer(initialState, setNoResults(true));
    expect(actual.noResults).toEqual(true);
  });
});
