// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { XPProvider } from './context/XPContext';
import { TaskProvider } from './context/TaskContext';
import TabNavigator from './navigation/TabNavigator';

export default function App() {

  return (
    <XPProvider>
      <TaskProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </TaskProvider>
    </XPProvider>
  );
}
