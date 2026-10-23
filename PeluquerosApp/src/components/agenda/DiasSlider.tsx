import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

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
    <View style={[styles.card, { width: ancho }]}>
      {ETIQUETAS_DIAS.map((etiqueta, posicion) => {
        const dia = sumarDias(item, posicion);
        const seleccionado = claveDia(dia) === claveDia(fechaSeleccionada);
        return (
          <Pressable
            key={posicion}
            accessibilityRole="button"
            accessibilityLabel={`${etiqueta} ${dia.getDate()}`}
            onPress={() => onSeleccionarDia(dia)}
            style={[styles.dia, seleccionado && styles.diaSeleccionado]}
          >
            <Text style={[styles.etiqueta, seleccionado && styles.textoSeleccionado]}>
              {etiqueta}
            </Text>
            <Text style={[styles.numero, seleccionado && styles.textoSeleccionado]}>
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
    height: 68,
  },
  listaContenido: {
    alignItems: 'flex-start',
  },
  card: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e8eb',
  },
  dia: {
    width: '12.5%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    borderRadius: 12,
  },
  diaSeleccionado: {
    backgroundColor: '#767677',
  },
  etiqueta: {
    fontSize: 12,
    color: '#9aa0a6',
  },
  numero: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  textoSeleccionado: {
    color: '#fff',
  },
});
