import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
//import expo-location
import * as Location from 'expo-location';
//import expo-image-picker
import * as ImagePicker from 'expo-image-picker';
//from firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {

    //return a reference (object) to Gifted Chat's ActionSheet
    const actionSheet = useActionSheet();

    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                console.log(location)
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }

    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    }

    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref)
            onSend({ image: imageURL })
        });
    }

    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted")
        }
    }

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted")
        }
    }



    //display a menu with options (take photo, select photo, share location)
    const onActionPress = () => {
        const options = ['Choose From Library', 'Take a Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        pickImage();
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        takePhoto();
                        return;
                    case 2:
                        console.log('user wants to get their location');
                        getLocation();
                    default:
                }
            }
        )
    }

    return (
        //create round button with the '+' symbol
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
            accessible={true}
            accessibilityLabel="more options"
            accessibilityHint="lets you choose to send an image or your geolocation"
        >
            {/* wrapperStyle and iconTextStyle are props */}
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>
                    +
                </Text>
            </View>
        </TouchableOpacity>
    );
}

//stylesheet
const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
        justifyContent: 'center'
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 15,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;