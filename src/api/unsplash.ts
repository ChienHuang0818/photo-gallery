// src/api/unsplash.ts
import axios from 'axios';

const API_URL = 'https://api.unsplash.com/search/photos';
const ACCESS_KEY = 'oQ1G5NYWPg-ezX9Ek1SiLF1d02kCbyxkXhL-zZ9FzUk';

export const fetchPhotos = async (query: string, page: number) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
      params: {
        query,
        page,
        per_page: 30,
      },
    });

    // 確保提取到的是正確的 URL
    return response.data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.small, // 確認這裡使用正確的 URL 屬性
      description: photo.alt_description,
      author: photo.user.name,
    }));
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};
