// src/App.jsx
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import AppRouter from './router';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
