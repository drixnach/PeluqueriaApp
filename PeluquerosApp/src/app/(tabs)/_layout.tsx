import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'estadisticas',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#202124',
        tabBarInactiveTintColor: '#9aa0a6',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lista-clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cliente-detalle"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="turno-detalle"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    paddingTop: 6,
    borderTopColor: '#e6e8eb',
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
