import { useEffect, useState } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Destructure name and background from route.params
const Chat = ({ route, navigation, db, isConnected }) => {
    const { name, background, id } = route.params;
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

    // Prevent rendering of InputToolbar when offline
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }
    // Messages database
    let unsubMessages;
    // useEffect hook to set messages options
    useEffect(() => {
        if (isConnected === true) {
            // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (documentSnapshot) => {
                let newMessages = [];
                documentSnapshot.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                });
                cacheMessagesHistory(newMessages);
                setMessages(newMessages);
            });
        } else loadCachedMessages();

        //clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    const loadCachedMessages = async () => {
        const cachedMessages = await
            AsyncStorage.getItem("chat_messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }
    const cacheMessagesHistory = async (listsToCache) => {
        try {
            await AsyncStorage.setItem('chat_messages', JSON.stringify(listsToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    /* Render a View component with dynamic background color */
    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={(messages) => onSend(messages)}
                user={{
                    //_id: route.params.id,
                    _id: id,
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