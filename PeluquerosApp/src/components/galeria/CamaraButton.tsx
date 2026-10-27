import { useRef, useState } from 'react';
import { Alert, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SymbolView } from 'expo-symbols';

type CamaraButtonProps = {
  onFotoTomada: (uri: string) => void;
};

export default function CamaraButton({ onFotoTomada }: CamaraButtonProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const abrirAjustes = () => {
    Linking.openSettings();
  };

  const mostrarAlertaAjustes = () => {
    Alert.alert(
      'Permiso requerido',
      'Necesitamos acceso a la cámara para tomar fotos. Puedes habilitarlo desde los ajustes del celular.',
      [
        { text: 'Ahora no', style: 'cancel' },
        { text: 'Abrir ajustes', onPress: abrirAjustes },
      ]
    );
  };

  const handlePress = async () => {
    if (!permission) {
      return;
    }

    if (permission.granted) {
      setModalVisible(true);
      return;
    }

    if (permission.canAskAgain === false) {
      mostrarAlertaAjustes();
      return;
    }

    const result = await requestPermission();
    if (result.granted) {
      setModalVisible(true);
      return;
    }

    if (result.canAskAgain === false) {
      mostrarAlertaAjustes();
      return;
    }

    Alert.alert(
      'Permiso requerido',
      'Necesitamos acceso a la cámara para tomar fotos.'
    );
  };

  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo?.uri) {
          onFotoTomada(photo.uri);
          setModalVisible(false);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.boton} onPress={handlePress} activeOpacity={0.8}>
        <SymbolView
          name={{ ios: 'camera.fill', android: 'camera_alt', web: 'photo_camera' }}
          tintColor="#202124"
          size={22}
        />
        <Text style={styles.texto}>Cámara</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={cerrarModal}>
        <View style={styles.modalContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.controles}>
            <TouchableOpacity style={styles.botonCancelar} onPress={cerrarModal}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCapturar} onPress={tomarFoto}>
              <View style={styles.circuloCapturar} />
            </TouchableOpacity>
            <View style={styles.espacioVacio} />
          </View>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#000',
  },
  botonCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  textoCancelar: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  botonCapturar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloCapturar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  espacioVacio: {
    width: 70,
  },
});
