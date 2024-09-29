// src/App.tsx

import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ChakraProvider>
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <LandingPage onLogin={setUser} />
      )}
    </ChakraProvider>
  );
}

export default App;