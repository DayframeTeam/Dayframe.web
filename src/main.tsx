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

// Сервисы, которые диспатчат
import { userService } from './entities/user/userService';
import { taskService } from './entities/task/taskService';

// 1) Рендерим простой экран загрузки
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка данных...</div>);

// 2) Загружаем данные перед монтированием App
(async function bootstrap() {
  try {
    await userService.fetchAndStoreCurrentUser();
    await taskService.fetchAndStoreAll();
  } catch (err) {
    console.error('Ошибка при первоначальной загрузке:', err);
    root.render(
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        Ошибка загрузки приложения.
      </div>
    );
    return;
  }

  // 3) Когда всё готово — монтируем приложение
  root.render(
    // <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    // </StrictMode>
  );
})();
