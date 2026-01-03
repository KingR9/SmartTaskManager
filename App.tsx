/**
 * ========================================
 * MAIN APP COMPONENT
 * ========================================
 * Root entry point - wraps app with providers
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

/**
 * Root App Component
 * 
 * Provider Hierarchy:
 * 1. AuthProvider - Makes user state available globally
 * 2. TaskProvider - Makes task operations available (needs AuthProvider)
 * 3. AppNavigator - Handles routing based on auth state
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.background}
        />
        <AppNavigator />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;