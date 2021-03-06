import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'

import { db } from '../../firebase'

const AddChatScreen = ({ navigation }) => {

    const [chatName, setChatName] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add New Chat',
            headerBackTitle: 'Chats'
        })
    }, [navigation])

    const createChat = async () => {
        await db.collection('chats').add({
            chatName: chatName
        }).then( () => navigation.goBack())
        .catch( error => alert(error))
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Input
                type="text"
                placeholder="Create new chat"
                value={chatName}
                onChangeText={(text) => setChatName(text)}
                onSubmitEditing={createChat}
                leftIcon={
                    <Icon name="wechat" type="antdesign" color="black" size={24}/>
                }
            />
            <Button title="Create new chat" onPress={createChat}/>
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
       padding: 20,
       height: '100%'
    }
})
