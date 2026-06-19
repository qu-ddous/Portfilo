import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { Toaster } from 'sonner';

import { useAuth } from './hooks/useAuth';
import { startInventoryPolling, stopInventoryPolling } from './store/inventoryStore';
import { startNotificationPolling, stopNotificationPolling } from './store/notificationStore';

function App() {
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      startInventoryPolling();
      startNotificationPolling();
    } else {
      stopInventoryPolling();
      stopNotificationPolling();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
