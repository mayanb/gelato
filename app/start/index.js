import { Navigation } from 'react-native-navigation';

// Import the screens
import Login from '../screens/Login';
import Main from '../screens/Main';
import Task from '../screens/Task';

// Register the screens for the navigator
export function registerScreens() {
	Navigation.registerComponent('gelato.Login', () => Login);
	Navigation.registerComponent('gelato.Main', () => Main);
	Navigation.registerComponent('gelato.Task', () => Task);
}