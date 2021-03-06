import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, KeyboardAvoidingView, View } from 'react-native'
import { Button, Input, Image, Text } from 'react-native-elements'

import { auth } from '../../firebase'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
       auth.onAuthStateChanged( authUser => {
            if (authUser){
                navigation.replace('Home')
            }
        })  
    }, [])

    const login = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch( error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/56/Logo_Signal..png" }} style={styles.logo} />
            <View style={styles.inputContainer}>
                <Input
                    type="text"
                    placeholder="Email"
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input} />
                <Input
                    autoCapitalize="none"
                    autoCorrect={false}
                    type="password"
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input} />
            </View>
            <Button title="Login" onPress={login} style={styles.button} />
            <Button
                title="Register"
                type="outline"
                style={styles.button}
                onPress={ () => navigation.navigate('Register')}
            />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    button: {
        width: 100,
        paddingTop: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 150,
        height: 150
    },
    inputContainer: {
        width: 300
    }
})
