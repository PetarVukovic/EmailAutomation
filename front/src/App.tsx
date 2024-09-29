// src/App.tsx

import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { User } from './types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ChakraProvider>
      <DndProvider backend={HTML5Backend}>
        {user ? (
          <Dashboard user={user} onLogout={() => setUser(null)} />
        ) : (
          <LandingPage onLogin={setUser} />
        )}
      </DndProvider>
    </ChakraProvider>
  );
}

export default App;