import React, { useState, useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { Input, Button, Image, Text } from 'react-native-elements'

import { auth } from '../../firebase'

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Back to Login'
        })
    }, [navigator])

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl || '../../assets/avatar.png'
            })
        }).catch( error => alert.error.message)
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <Text h4 style={{ marginBottom: 50 }}>Create a new account</Text>
            <View style={styles.inputContainer}>
                <Input
                    type="text"
                    placeholder="Full name"
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Input
                    type="email"
                    placeholder="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input
                    type="text"
                    placeholder="Image URL"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={imageUrl}
                    onChangeText={(text) => setImageUrl(text)}
                    onSubmitEditing={register}
                />
            </View>

            <Button
                title="Submit"
                raised
                onPress={register}
                style={styles.button}
            />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    button: {
        width: 100
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300
    }
})
