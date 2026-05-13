import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStage from './voiceNorth/RootStage';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#040A1A" translucent />
      <RootStage />
    </SafeAreaProvider>
  );
}

export default App;
