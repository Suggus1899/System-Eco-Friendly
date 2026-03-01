/**
 * EcoGestión Local - Mobile App
 * Sistema de gestión ecológica local
 */

import React from 'react';
import { Provider } from 'jotai';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <Provider>
      <AppNavigator />
    </Provider>
  );
}

export default App;
