import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Foto } from '@/store/galeriaStore';

type GrillaFotosProps = {
  fotos: Foto[];
};

const { width } = Dimensions.get('window');
const SPACING = 8;
const NUM_COLUMNS = 3;
const SIZE = (width - SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function GrillaFotos({ fotos }: GrillaFotosProps) {
  if (!fotos || fotos.length === 0) {
    return (
      <View style={styles.vacioContainer}>
        <Text style={styles.vacioTexto}>No hay foto de cortes todavía...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={fotos}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={styles.lista}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.foto} resizeMode="cover" />
      )}
    />
  );
}

const styles = StyleSheet.create({
  vacioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  vacioTexto: {
    fontSize: 16,
    color: '#4a5199',
    textAlign: 'center',
  },
  lista: {
    paddingHorizontal: SPACING,
    paddingTop: SPACING,
    paddingBottom: 120,
  },
  foto: {
    width: SIZE,
    height: SIZE,
    borderRadius: 10,
    margin: SPACING / 2,
    backgroundColor: '#f1f3f4',
  },
});
