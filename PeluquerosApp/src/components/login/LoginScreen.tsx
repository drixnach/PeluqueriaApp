import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Alert
} from 'react-native';
import { useLogin } from '@/hooks/useLogin';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { LoginButton } from './LoginButton';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';

export function LoginScreen() {

    const [email, setEmail]=useState('');
    const [numPelu, setNumPelu]=useState('');
    const [password, setPassword]=useState('')
    const [peluqueria, setPeluqueria]=useState('');
    const [isLoading, setIsLoading]=useState(false);

    const validarLogin=()=>{
        if(!email||!/\S+@\S+\.\S+/.test(email)){
            Alert.alert('Error','Por favor ingrese un email valido');
            return false;
            }

        if(!password){
            Alert.alert('Ingrese su contraseña')
            return false
            }

        return true;
    };


    const handleLogin=()=>{
        if(!validarLogin()) return;

        setIsLoading(true)

    // Simulación de login
        setTimeout(() => {
          setIsLoading(false);
          Alert.alert('Login correcto', `Bienvenido ${email} a la peluquería ${peluqueria}`);

          router.push('/inicio');
        }, 1500);
      };

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
            numPelu={numPelu}
            setNumPelu={setNumPelu}
            password={password}
            setPassword={setPassword}
            peluqueria={peluqueria}
            setPeluqueria={setPeluqueria}
          />
          <LoginButton isLoading={isLoading} onPress={handleLogin} />
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