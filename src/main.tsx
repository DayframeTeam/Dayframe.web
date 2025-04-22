import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import './styles/variables.css';
import './sw.ts';
import './i18n';
import 'react-datepicker/dist/react-datepicker.css';
import App from './App.tsx';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
