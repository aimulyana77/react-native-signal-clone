import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Avatar } from 'react-native-elements'
import { StyleSheet, ScrollView, SafeAreaView, View, TouchableOpacity } from 'react-native'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'

import { auth, db } from '../../firebase'

import CustomListItem from '../components/CustomListItem'



const HomeScreen = ({ navigation }) => {

    const [ chats, setChats ] = useState([])

    const logout = () => {
        auth.signOut()
        .then( () => navigation.replace('Login'))
    }

    useEffect(() => {
       db.collection('chats').onSnapshot( snapshot => ( setChats(snapshot.docs.map( doc => ({
            id: doc.id,
            data: doc.data()
        })))))
        
    }, [])

    const enterChat = ( id, chatName ) => {
        navigation.navigate('Chat', {
            id, chatName
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Signal',
            headerStyle: {
                backgroundColor: '#fff'
            },
            headerTitleStyle: {
                color: '#000'
            },
            headerTintColor: '#000',
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.5} onPress={logout}>
                    <View style={{ marginLeft: 20 }}>
                        <Avatar rounded source={require('../../assets/avatar.png')} />
                    </View>
                </TouchableOpacity>

            ),
            headerRight: () => (
                <View style={styles.camera}>
                    <TouchableOpacity>
                        <AntDesign name="camerao" size={24} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <SimpleLineIcons name="pencil" size={24} color='black' onPress={ () => navigation.navigate('AddChat')}/>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])
    return (
        <SafeAreaView>
            <StatusBar style="dark" />
            <ScrollView style={styles.container}>
                { chats.map( ({ id, data: { chatName } }) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
                ))}
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    camera: {
        flexDirection: 'row',
        marginRight: 20,
        justifyContent: 'space-between',
        width: 80
    },
    container: {
        height: '100%'
    }
})
