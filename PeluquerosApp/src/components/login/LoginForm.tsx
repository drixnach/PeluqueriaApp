import React from 'react';
import { View } from 'react-native';
import { TextField } from '@/components/ui/TextField';

type Props={
  email:string;
  setEmail:(v:string)=>void;
  password:string;
  setPassword:(v:string)=>void;

}

export function LoginForm({email, setEmail,password, setPassword}:Props){
  return(
    <View>
      <TextField 
        label= "email"
        placeholder='asd@asd.com'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'/>
      <TextField
        label='Contraseña'
        placeholder='*******'
        value={password}
        onChangeText={setPassword}
        secureTextEntry/>
        
    </View>
  )
}