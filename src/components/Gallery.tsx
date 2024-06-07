import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getPhotos, selectPhoto, setSearchQuery, incrementPage, Photo, triggerSearch, setNoResults } from '../store/photoSlice';
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
  const trigger = useSelector((state: RootState) => state.photos.triggerSearch);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (searchTriggered && searchQuery) {
      dispatch(getPhotos({ query: searchQuery, page })).then((action) => {
        setSearchTriggered(false);  
        if (action.payload.length === 0) {
          setErrorMessage('No results');
        } else {
          setErrorMessage('');
        }
      });
    }
  }, [dispatch, searchQuery, page, searchTriggered]);

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
    dispatch(triggerSearch(true));
    dispatch(setNoResults(false)); 
    dispatch(getPhotos({ query: searchQuery, page: 1 })).then((action) => {
      if (action.payload.length === 0) {
        setErrorMessage('No results');
      } else {
        setErrorMessage('');
      }
    });
  };

  const loader = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore && trigger) {
      dispatch(incrementPage());
    }
  }, [dispatch, hasMore, trigger]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [handleObserver]);

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

      {!isLoading && searchTriggered && photos.length === 0 && !errorMessage && (
        <Message>No results</Message>
      )}

      <GalleryGrid>
        {photos.map((photo: Photo) => (
          <GalleryItem key={photo.id} onClick={() => handleImageClick(photo)}>
            <GalleryImage src={photo.url} alt={photo.description} />
          </GalleryItem>
        ))}
      </GalleryGrid>

      {isLoading && <Loader />} 

      <div ref={loader}></div> 

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

export default Gallery;
