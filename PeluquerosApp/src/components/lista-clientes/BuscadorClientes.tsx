import { SymbolView } from 'expo-symbols';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type BuscadorClientesProps = {
  consulta: string;
  onQueryChange: (consulta: string) => void;
};

export function BuscadorClientes({ consulta, onQueryChange }: BuscadorClientesProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <SymbolView
          name={{
            ios: 'magnifyingglass',
            android: 'search',
            web: 'search',
          }}
          tintColor={colors.primaryInactive}
          size={19}
        />
      <TextInput
          placeholder="Buscar Cliente..."
          value={consulta}
          onChangeText={onQueryChange}
        showSoftInputOnFocus={true}
        autoFocus={false}
        placeholderTextColor={colors.primaryInactive}
        style={[styles.input, { color: colors.text }]}
      />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    paddingLeft: 10,
  },
});

