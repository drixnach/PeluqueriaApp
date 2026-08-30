import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, Text, View } from 'react-native';
import { PELUQUERIAS } from '@/constants/peluquerias';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function PeluqueriaDropdown({ value, onChange }: Props) {
  return (
    <View>
      <Text style={styles.label}>Peluquería</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={PELUQUERIAS}
        labelField="label"
        valueField="value"
        placeholder="Seleccioná una peluquería..."
        value={value}
        onChange={(item) => onChange(item.value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  placeholderStyle: { fontSize: 16, color: '#999' },
  selectedTextStyle: { fontSize: 16, color: '#333' },
});