import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {store} from './store';
import {Navigation} from './navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StoreProvider store={store}>
        <PaperProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Navigation />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default App;
