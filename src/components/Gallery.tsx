import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getPhotos, selectPhoto, setSearchQuery, incrementPage, triggerSearch, setNoResults, Photo } from '../store/photoSlice';
import { RootState, AppDispatch } from '../store/store';
import logo from '../assets/logo.png';
import Loader from './Loader';

const Gallery: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const photos = useSelector((state: RootState) => state.photos.photos);
  const selectedPhoto = useSelector((state: RootState) => state.photos.selectedPhoto);
  const searchQuery = useSelector((state: RootState) => state.photos.searchQuery);
  const page = useSelector((state: RootState) => state.photos.page);
  const hasMore = useSelector((state: RootState) => state.photos.hasMore);
  const isLoading = useSelector((state: RootState) => state.photos.isLoading);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadMoreClicked, setLoadMoreClicked] = useState(false); // 新增狀態來追踪是否點擊了 "Load More"
  const [hasSearched, setHasSearched] = useState(false); // 新增狀態來追踪是否進行了搜索

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchTriggered && searchQuery) {
      console.log('Fetching photos with query:', searchQuery, 'and page:', page);
      dispatch(getPhotos({ query: searchQuery, page })).then((action) => {
        setSearchTriggered(false);  
        if (action.payload.length === 0) {
          setErrorMessage('No results');
        } else {
          setErrorMessage('');
        }
      }).catch((error) => {
        setSearchTriggered(false);
        setErrorMessage('Failed to fetch photos. Please try again later.');
      });
    }
  }, [dispatch, searchQuery, page, searchTriggered]);

  useEffect(() => {
    if (page > 1) {
      console.log('Loading more photos for page:', page);
      dispatch(getPhotos({ query: searchQuery, page })).catch((error) => {
        setErrorMessage('Failed to load more photos. Please try again later.');
      });
    }
  }, [dispatch, page, searchQuery]);

  const handleImageClick = (photo: Photo) => {
    dispatch(selectPhoto(photo));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    setErrorMessage('');  
    if (!e.target.value.trim()) {
      setSearchTriggered(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a keyword to search');
      return;
    }
    setSearchTriggered(true);
    setHasSearched(true); // 更新狀態為已進行搜索
    dispatch(triggerSearch(true));
    dispatch(setNoResults(false)); 
    dispatch(getPhotos({ query: searchQuery, page: 1 })).then((action) => {
      if (action.payload.length === 0) {
        setErrorMessage('No results');
      } else {
        setErrorMessage('');
      }
    }).catch((error) => {
      setSearchTriggered(false);
      setErrorMessage('Failed to fetch photos. Please try again later.');
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      console.log('Load more button clicked');
      dispatch(incrementPage());
      setLoadMoreClicked(true); // 設置狀態為已點擊
    }
  };

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      dispatch(incrementPage());
    }
  }, [dispatch, hasMore, isLoading]);

  useEffect(() => {
    if (loadMoreClicked) { // 只有在點擊 "Load More" 後才啟動觀察者
      const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '20px',
        threshold: 1.0,
      });
      const currentLoader = loaderRef.current; // 使用局部變量保存 loaderRef.current 的值
      if (currentLoader) {
        observer.observe(currentLoader);
      }
      return () => {
        if (currentLoader) {
          observer.unobserve(currentLoader);
        }
      };
    }
  }, [observerCallback, loadMoreClicked]);

  return (
    <GalleryContainer>
      <Logo src={logo} alt="Cinefly Logo" />
      <SearchBarContainer onSubmit={handleSearchSubmit}>
        <SearchBar
          type="text"
          placeholder="Search Photo"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchBarContainer>

      {errorMessage && <Message>{errorMessage}</Message>}

      <GalleryGrid>
        {photos.map((photo: Photo) => (
          <GalleryItem key={photo.id} onClick={() => handleImageClick(photo)}>
            <GalleryImage src={photo.url} alt={photo.description} />
          </GalleryItem>
        ))}
      </GalleryGrid>

      {isLoading && <Loader />} 

      {hasSearched && !loadMoreClicked && hasMore && !isLoading && (
        <LoadMoreButton onClick={handleLoadMore}>Load More</LoadMoreButton>
      )}

      <div ref={loaderRef}></div>

      {!hasMore && !isLoading && photos.length > 0 && (
        <Message>No more results</Message>
      )}

      {selectedPhoto && (
        <PhotoDetails>
          <PhotoDetailsImage src={selectedPhoto.url} alt={selectedPhoto.description} />
          <p><strong>Author:</strong> {selectedPhoto.author}</p>
          <p><strong>Description:</strong> {selectedPhoto.description}</p>
          <CloseButton onClick={() => dispatch(selectPhoto(null))}>close</CloseButton>
        </PhotoDetails>
      )}
    </GalleryContainer>
  );
};

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Logo = styled.img`
  width: 200px;
  margin-bottom: 20px;
`;

const SearchBarContainer = styled.form`
  display: flex;
  width: 80%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: pink;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

const GalleryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const GalleryItem = styled.div`
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const PhotoDetails = styled.div`
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  background: #fff;
  border: 1px solid #ccc;
  z-index: 1000;
  width: 80%;
  max-width: 600px;
  overflow-y: auto;
  max-height: 80vh;
`;

const PhotoDetailsImage = styled.img`
  max-width: 100%;
  max-height: 60vh;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #777;
  margin-top: 20px;
`;

const LoadMoreButton = styled.button`
  margin: 20px;
  padding: 10px 20px;
  background-color: pink;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

export default Gallery;
