import './config/ReactotronConfig';
import React from 'react';
import {StatusBar} from 'react-native';

import Routes from './routes';

if (__DEV__) {
  import('./config/ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );
}

const App = () => {
  return (
    <>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
    </>
  );
};

export default App;
