import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

//import for authentication
import { getAuth, signInAnonymously } from "firebase/auth";


const Start = ({ navigation }) => {

    //authentication
    const auth = getAuth();

    const signInUser = () => {
        signInAnonymously(auth).then(result => {
            navigation.navigate("Chat", { userID: result.user.uid, name: name, color: color });
            Alert.alert("Signed in Successfully!")
        }).catch((error) => {
            Alert.alert("Unable to sign in, try again later.");
        })
    }

    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.backgroundImage} source={require('../assets/background-image.png')}>
                <Text style={styles.appTitle}>Chat App</Text>
                <View style={styles.infoBox}>
                    <View style={styles.textInput}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder='Your name'
                        />
                    </View>
                    <Text style={styles.chooseColor}>Choose Background Color:</Text>
                    <View style={styles.sampleContainer}>
                        <TouchableOpacity onPress={() => setColor('#090c08')} style={styles.colorSample}></TouchableOpacity>
                        <TouchableOpacity onPress={() => setColor('#474056')} style={[styles.colorSample, styles.sampleTwo]}></TouchableOpacity>
                        <TouchableOpacity onPress={() => setColor('#8A95A5')} style={[styles.colorSample, styles.sampleThree]}></TouchableOpacity>
                        <TouchableOpacity onPress={() => setColor('#B9C6AE')} style={[styles.colorSample, styles.sampleFour]}></TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() => { { signInUser() } }}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 2,
        borderColor: '#757083',
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 0.5,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'row'

    },
    appTitle: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 50
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoBox: {
        backgroundColor: '#FFFFFF',
        height: '44%',
        width: '88%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 200
    },
    chooseColor: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 0.8,
        width: '88%',
        marginBottom: 10

    },
    colorSample: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#090c08',
        marginRight: 20
    },
    sampleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '88%'
    },
    sampleTwo: {
        backgroundColor: '#474056'
    },
    sampleThree: {
        backgroundColor: '#8A95A5'
    },
    sampleFour: {
        backgroundColor: '#B9C6AE'
    },

    chatButton: {
        height: 60,
        width: '88%',
        backgroundColor: '#757083',
        marginTop: 15,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF'
    },
    icon: {
        color: '#757083',
        backgroundColor: 'black'
    }
})

export default Start;