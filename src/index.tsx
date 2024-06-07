// src/index.tsx
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store'; // 确保这里使用默认导入
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
