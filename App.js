import { Alert } from 'react-native';
import { useState, useEffect } from 'react';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useNetInfo } from "@react-native-community/netinfo";

//import from firestore
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const App = () => {
  // new state that represents network connectivity status
  const connectionStatus = useNetInfo();

  // display an alert popup if the connection is lost
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost");
      disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db)
    }
  }, [connectionStatus.isConnected]);

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
  const db = getFirestore(app);

  //initialize the storage handler
  const storage = getStorage(app);


  const [text, setText] = useState('');
  const alertMyText = () => {
    Alert.alert(text);
  }
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>

    </NavigationContainer>
  );
}




export default App;