import { StatusBar } from 'expo-status-bar';
import { StyleSheet, LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import Firestore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDsZdLWIGy-GsUV81SAn7_ZmYrQuVGLUNg",
    authDomain: "chatapp-14ddb.firebaseapp.com",
    projectId: "chatapp-14ddb",
    storageBucket: "chatapp-14ddb.appspot.com",
    messagingSenderId: "143195800702",
    appId: "1:143195800702:web:0318b70bcaa54463fd842f"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app)

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;