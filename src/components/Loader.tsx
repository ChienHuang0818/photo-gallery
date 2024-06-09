import styled from 'styled-components';

const Loader: React.FC = () => {
  return (
    <LoaderContainer data-testid="loader-container">
      <LoaderIcon data-testid="loader-icon" />
    </LoaderContainer>
  );
};


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const LoaderIcon = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #22a6b3;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
