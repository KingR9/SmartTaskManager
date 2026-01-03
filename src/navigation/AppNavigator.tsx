import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { TaskListScreen } from '../screens/TaskListScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';

/**
 * Define navigation parameter types for type safety
 */
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TaskList: undefined;
  AddTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main app navigator with conditional authentication flow
 * Automatically redirects based on auth state
 */
export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Custom headers in each screen
          animation: 'slide_from_right',
        }}
      >
        {user ? (
          // Authenticated Stack
          <>
            <Stack.Screen name="TaskList" component={TaskListScreen} />
            <Stack.Screen 
              name="AddTask" 
              component={AddTaskScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </>
        ) : (
          // Unauthenticated Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
