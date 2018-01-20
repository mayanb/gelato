import { Navigation } from 'react-native-navigation'

// Import the screens
import Login from '../screens/Login'
import Main from '../screens/Main'
import CreateTask from '../screens/CreateTask'
import Task from '../screens/Task'

// Register the screens for the navigator
// export function registerScreens() {
// 	Navigation.registerComponent('gelato.Login', () => Login);
// 	Navigation.registerComponent('gelato.Main', () => Main);
// 	Navigation.registerComponent('gelato.Task', () => Task);
// }

export  function registerScreens(store, Provider) {
	Navigation.registerComponent('gelato.Login', () => Login, store, Provider)
	Navigation.registerComponent('gelato.Main', () => Main, store, Provider)
	Navigation.registerComponent('gelato.CreateTask', () => CreateTask, store, Provider)
	Navigation.registerComponent('gelato.Task', () => Task, store, Provider)
}