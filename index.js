/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import { Router } from './src/routes/Router';
import { AppwriteProvider } from './src/appwrite/AppwriteContext'; 

const App = () => (
  <AppwriteProvider>
    <Router />
  </AppwriteProvider>
);

AppRegistry.registerComponent(appName, () => App);
