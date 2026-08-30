import { useState } from 'react';
import { router } from 'expo-router';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [numPelu, setNumPelu] = useState('');
  const [password, setPassword] = useState('');
  const [peluqueria, setPeluqueria] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please fill out all fields.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log('Logging in with:', { email, password, numPelu, peluqueria });
      alert('Login successful!');
      router.push('/inicio'); 
    }, 2000);
  };

  return {
    email, setEmail,
    numPelu, setNumPelu,
    password, setPassword,
    peluqueria, setPeluqueria,
    isLoading,
    handleLogin,
  };
}