import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useLogin } from '@/hooks/useLogin';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { LoginButton } from './LoginButton';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

export function LoginScreen() {
  const {
    email, setEmail,
    numPelu, setNumPelu,
    password, setPassword,
    peluqueria, setPeluqueria,
    isLoading,
    handleLogin,
  } = useLogin();

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
});