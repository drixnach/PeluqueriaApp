import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Alert,
  ScrollView  
} from 'react-native';
import {router} from 'expo-router'
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { LoginButton } from './LoginButton';
import { useLogin } from '@/api/useLogin';
import Login from '@/app/login';

export function LoginScreen() {

    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('')
    const { mutate: login, isPending } = useLogin();

    const validarLogin=()=>{
        if(!email||!/\S+@\S+\.\S+/.test(email)){
            Alert.alert('Error','Por favor ingrese un email valido');
            return false;
            }

        if(!password){
            Alert.alert('Error','Ingrese su contraseña')
            return false
            }

        return true;
    };


    const handleLogin=()=>{
        if(!validarLogin()) return;

    login(
      {email, password},
      {
        onSuccess:()=>router.replace('/lista-clientes'),
        onError:(error)=>Alert.alert('Error',error.message),
      }
    )
  }
    

    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.formCard}>
          <LoginHeader />
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
          <LoginButton isLoading={isPending} onPress={handleLogin} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
})
