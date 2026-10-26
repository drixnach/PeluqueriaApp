import { Alert, Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SymbolView } from 'expo-symbols';

type GaleriaButtonProps = {
  onFotoSeleccionada: (uri: string) => void;
};

export default function GaleriaButton({ onFotoSeleccionada }: GaleriaButtonProps) {
  const abrirAjustes = () => {
    Linking.openSettings();
  };

  const mostrarAlertaAjustes = () => {
    Alert.alert(
      'Permiso requerido',
      'Necesitamos acceso a tu galería para seleccionar fotos. Puedes habilitarlo desde los ajustes del celular.',
      [
        { text: 'Ahora no', style: 'cancel' },
        { text: 'Abrir ajustes', onPress: abrirAjustes },
      ]
    );
  };

  const seleccionarFoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.8,
          exif: false,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          if (uri) {
            onFotoSeleccionada(uri);
          }
        }
        return;
      }

      if (permissionResult.canAskAgain === false) {
        mostrarAlertaAjustes();
        return;
      }

      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galería para seleccionar fotos.'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  return (
    <TouchableOpacity style={styles.boton} onPress={seleccionarFoto} activeOpacity={0.8}>
      <SymbolView
        name={{ ios: 'photo.fill', android: 'photo_library', web: 'photo_library' }}
        tintColor="#202124"
        size={22}
      />
      <Text style={styles.texto}>Galería</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e8eb',
    gap: 8,
    marginHorizontal: 4,
  },
  texto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
  },
});
