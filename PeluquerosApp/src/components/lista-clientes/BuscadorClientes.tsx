import { SymbolView } from 'expo-symbols';
import { StyleSheet, TextInput, View } from 'react-native';

type BuscadorClientesProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function BuscadorClientes({ query, onQueryChange }: BuscadorClientesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <SymbolView
          name={{
            ios: 'magnifyingglass',
            android: 'search',
            web: 'search',
          }}
          tintColor="#7a8087"
          size={19}
        />
      <TextInput
         placeholder="Buscar Cliente..."
         value={query}
         onChangeText={onQueryChange}
        showSoftInputOnFocus={true}
        autoFocus={false}
        placeholderTextColor="#9aa0a6"
        style={styles.input}
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderColor: '#e1e4e8',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    minHeight: 48,
  },
  input: {
    flex: 1,
    color: '#202124',
    fontSize: 14,
    paddingVertical: 0,
    paddingLeft: 10,
  },
});
