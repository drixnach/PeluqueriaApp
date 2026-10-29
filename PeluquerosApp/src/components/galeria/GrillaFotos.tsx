import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Foto } from '@/store/galeriaStore';
import { useTheme } from '@/theme/ThemeProvider';

type GrillaFotosProps = {
  fotos: Foto[];
};

const { width } = Dimensions.get('window');
const SPACING = 8;
const NUM_COLUMNS = 3;
const SIZE = (width - SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function GrillaFotos({ fotos }: GrillaFotosProps) {
  const { colors } = useTheme();
  if (!fotos || fotos.length === 0) {
    return (
      <View style={styles.vacioContainer}>
        <Text style={[styles.vacioTexto, { color: colors.primaryInactive }]}>No hay foto de cortes todavía...</Text>
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
        <Image source={{ uri: item.uri }} style={[styles.foto, { backgroundColor: colors.inputBackground }]} resizeMode="cover" />
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
  },
});

