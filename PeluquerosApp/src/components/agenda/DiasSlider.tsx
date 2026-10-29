import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type DiasSliderProps = {
  fechaSeleccionada: Date;
  onSeleccionarDia: (dia: Date) => void;
};

const ETIQUETAS_DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const SEMANAS_ANTES = 26;
const SEMANAS_DESPUES = 104;

function lunesDe(fecha: Date): Date {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7)); // lunes = 0
  return lunes;
}

function sumarDias(fecha: Date, dias: number): Date {
  const resultado = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

function claveDia(fecha: Date): string {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

export function DiasSlider({ fechaSeleccionada, onSeleccionarDia }: DiasSliderProps) {
  const { colors } = useTheme();
  // Ancho completo de la pantalla: una semana por página
  const ancho = useWindowDimensions().width;

  // Lista fija de semanas: desde 26 semanas antes hasta 104 semanas después de la actual
  const semanas = useMemo(() => {
    const lunesHoy = lunesDe(new Date());
    return Array.from(
      { length: SEMANAS_ANTES + SEMANAS_DESPUES + 1 },
      (_, i) => sumarDias(lunesHoy, (i - SEMANAS_ANTES) * 7)
    );
  }, []);
  const indiceInicial = SEMANAS_ANTES;

  // Al terminar de deslizar, se elige el mismo día de la semana de la semana visible
  const manejarFinDeScroll = (
    evento: { nativeEvent: { contentOffset: { x: number } } }
  ) => {
    const indice = Math.round(evento.nativeEvent.contentOffset.x / ancho);
    const lunesVisible = semanas[indice];
    const diaSemana = (fechaSeleccionada.getDay() + 6) % 7;
    const nuevoDia = sumarDias(lunesVisible, diaSemana);
    if (claveDia(nuevoDia) !== claveDia(fechaSeleccionada)) {
      onSeleccionarDia(nuevoDia);
    }
  };

  const renderSemana = ({ item }: { item: Date }) => (
    <View style={[styles.card, { width: ancho, borderBottomColor: colors.border }]}>
      {ETIQUETAS_DIAS.map((etiqueta, posicion) => {
        const dia = sumarDias(item, posicion);
        const seleccionado = claveDia(dia) === claveDia(fechaSeleccionada);
        return (
          <Pressable
            key={posicion}
            accessibilityRole="button"
            accessibilityLabel={`${etiqueta} ${dia.getDate()}`}
            onPress={() => onSeleccionarDia(dia)}
            style={[styles.dia, seleccionado && [styles.diaSeleccionado, { backgroundColor: colors.primary }]]}
          >
            <Text style={[styles.etiqueta, { color: colors.primaryInactive }, seleccionado && { color: colors.background }]}>
              {etiqueta}
            </Text>
            <Text style={[styles.numero, { color: colors.text }, seleccionado && { color: colors.background }]}>
              {dia.getDate()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <FlatList
      data={semanas}
      keyExtractor={(item) => claveDia(item)}
      renderItem={renderSemana}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.lista}
      contentContainerStyle={styles.listaContenido}
      initialScrollIndex={indiceInicial}
      getItemLayout={(_, indice) => ({
        length: ancho,
        offset: ancho * indice,
        index: indice,
      })}
      onMomentumScrollEnd={manejarFinDeScroll}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flexGrow: 0,
    flexShrink: 0,
    height: 86,
  },
  listaContenido: {
    alignItems: 'flex-start',
    paddingRight: 0,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 58,
    paddingVertical: 12,
    borderRadius: 18,
  },
  diaSeleccionado: {
  },
  etiqueta: {
    fontSize: 12,
  },
  numero: {
    fontSize: 16,
    fontWeight: '600',
  },
});

