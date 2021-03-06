import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, SafeAreaView, TouchableOpacity, Platform, KeyboardAvoidingView, View, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native'
import { Text, Avatar } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import { Keyboard } from 'react-native'

import * as firebase from 'firebase'
import { db, auth } from '../../firebase'


const ChatScreen = ({ navigation, route }) => {

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <Avatar rounded source={{uri: messages[0]?.data.photoURL}} />
                    <Text style={{ marginLeft: 10, color: 'white' }}>{route.params.chatName}</Text>
                </View>
            ),
            headerTitleAlign: "left",
            headerBackTitleVisible: false,
            headerLeft: () => (
                <View>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <AntDesign name="back" size={24} color="white" style={{ paddingLeft: 10 }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20
                }}>
                    <TouchableOpacity >
                        <FontAwesome name="video-camera" size={24} color="white" style={{ paddingLeft: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Ionicons name="call" size={24} color="white" style={{ paddingLeft: 10 }} />
                    </TouchableOpacity>
                </View>
            )
        })

    }, [navigation, messages])

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').doc(route.params.id).collection('messages').orderBy('timestamp', 'desc').onSnapshot((snapshot) => setMessages(snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }))))
        return () => {
            unsubscribe
        };
    }, [route])

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        });

        setInput('');
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={
                Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
                style={styles.container}
            >
                <StatusBar style="light" />
                <TouchableWithoutFeedback onPress={sendMessage}>
                    <>
                        <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
                            {messages.map(({ id, data }) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar
                                            position="absolute"
                                            rounded
                                            source={{ uri: data.photoURL }}
                                            size={30}
                                            bottom={-15}
                                            right={-5} 
                                            //Web
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                right: -5
                                            }} />
                                        <Text style={styles.receiverText}>{data.message}</Text>
                                    </View>

                                ) : (
                                        <View key={id} style={styles.sender}>
                                            <Avatar
                                                position="absolute"
                                                rounded
                                                source={{ uri: data.photoURL }}
                                                size={30}
                                                bottom={-15}
                                                left={-5}
                                                //Web
                                                containerStyle={{
                                                    position: "absolute",
                                                    bottom: -15,
                                                    left: -5
                                                }} />
                                            <Text style={styles.senderText}>{data.message}</Text>
                                            <Text style={styles.name}>{data.displayName}</Text>
                                        </View>
                                    )
                            ))
                            }
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput
                                placeholder="Send a message"
                                autoCorrect={false}
                                autoCapitalize="none"
                                style={styles.textInput}
                                value={input}
                                onChangeText={text => setInput(text)}
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                                <Ionicons name="send" size={24} color="blue" />
                            </TouchableOpacity>

                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    footer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        padding: 15
    },
    name: {
        fontSize: 10,
        fontStyle: 'italic'
    },
    receiver: {
        padding: 15,
        backgroundColor: '#E1FDE8',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
    },
    receiverText: {
        color: '#4B4C4B',
    },
    sender: {
        padding: 15,
        backgroundColor: '#FDD7D3',
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    senderText: {
        color: '#4B4C4B'
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: 'grey',
        borderWidth: 1,
        paddingLeft: 10,
        color: 'grey',
        borderRadius: 20
    }
})
