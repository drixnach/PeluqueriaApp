import React from 'react';
import { View } from 'react-native';
import { PeluqueriaDropdown } from '@/components/ui/PeluqueriasDropdown'
import { TextField } from '@/components/ui/TextField';

type Props = {
  email: string;
  setEmail: (v: string) => void;
  numPelu: string;
  setNumPelu: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  peluqueria: string;
  setPeluqueria: (v: string) => void;
};

export function LoginForm({
  email, setEmail,
  numPelu, setNumPelu,
  password, setPassword,
  peluqueria, setPeluqueria,
}: Props) {
  return (
    <View>
      <PeluqueriaDropdown value={peluqueria} onChange={setPeluqueria} />

      <TextField
        label="Email"
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextField
        label="Numero"
        placeholder="20123456789"
        value={numPelu}
        onChangeText={setNumPelu}
        keyboardType="number-pad"
      />

      <TextField
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>
  );
}