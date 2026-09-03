import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

type Props={
    value:string;
    onChange:(v:string)=>void
    };

export function PeluqueriaDropdown({value, onChange}:Props){
    return(
        <View style={styles.container}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue)=>onChange(itemValue)}
                >
                <Picker.Item label="Seleccione una Peluqueria" value=""/>
                <Picker.Item label="1-Peluqueria Central" value="1"/>
                <Picker.Item label="2-Peluqueria Nueva Cba" value="2"/>
                <Picker.Item label="3-Peluqueria Alberdi" value="3"/>
                <Picker.Item label="4-Peluqueria Gral Paz" value="4"/>
            </Picker>
        </View>
        );
    }

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    }
  })