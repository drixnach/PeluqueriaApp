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
      alert('Completa los campos.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert('Bienvenido!');
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