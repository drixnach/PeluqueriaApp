import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      
      <Image
         source={require('../../assets/images/aplicacion-construccion.png')}
        style={styles.image}
      />
      
      
      <Text style={styles.text}>
        Agenda en construccion...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',    
    backgroundColor: '#f5f5f5', 
  },
  image: {
    width: 230,
    height: 230,
    marginBottom: 20,         
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',         
    textAlign: 'center',      
  },
});
