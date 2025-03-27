import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import './styles/variables.css';
import App from './components/App.tsx';
import './sw.ts';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './i18n';
import 'react-datepicker/dist/react-datepicker.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  // </StrictMode>
);
