import { useEffect, useState } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
// Destructure name and background from route.params
const Chat = ({ route, navigation, db }) => {
    const { name, background, userID } = route.params;
    const [messages, setMessages] = useState([]);
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    };

    // Customize speech bubble
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#484848",
                    },
                    left: {
                        backgroundColor: "#fff",
                    },
                }}
            />
        );
    };

    // useEffect hook to set messages options
    useEffect(() => {
        navigation.setOptions({ title: name });
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach(doc => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
                })
            })
            setMessages(newMessages);
        })
        //clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);

    // useEffect hook to set navigation options
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);
    /* Render a View component with dynamic background color */
    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={(messages) => onSend(messages)}
                user={{
                    //_id: route.params.id,
                    _id: userID,
                    name: name,
                }}
            />
            {Platform.OS === "android" ? (
                <KeyboardAvoidingView behavior="height" />
            ) : null}
        </View>
    );
};

// Define styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;