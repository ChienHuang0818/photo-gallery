import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchPhotos } from '../../api/unsplash'; 

describe('fetchPhotos', () => {
  let mock: MockAdapter;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  afterEach(() => {
    mock.restore();
    consoleErrorSpy.mockRestore(); 
  });

  it('should fetch photos and return them in the correct format', async () => {
    const mockData = {
      results: [
        {
          id: '1',
          urls: { small: 'test-url-1' },
          alt_description: 'test-1',
          user: { name: 'author-1' },
        },
        {
          id: '2',
          urls: { small: 'test-url-2' },
          alt_description: 'test-2',
          user: { name: 'author-2' },
        },
      ],
    };

    mock.onGet('https://api.unsplash.com/search/photos').reply(200, mockData);

    const photos = await fetchPhotos('cats', 1);

    expect(photos).toEqual([
      { id: '1', url: 'test-url-1', description: 'test-1', author: 'author-1' },
      { id: '2', url: 'test-url-2', description: 'test-2', author: 'author-2' },
    ]);
  });

  it('should throw an error when the API request fails', async () => {
    mock.onGet('https://api.unsplash.com/search/photos').reply(500);

    await expect(fetchPhotos('cats', 1)).rejects.toThrow('Request failed with status code 500');
  });
});
