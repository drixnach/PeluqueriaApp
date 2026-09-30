import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient=new QueryClient(  )

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="login"
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="lista-clientes" />
      <Stack.Screen name="inicio" />
    </Stack>
    </QueryClientProvider>
  );
}
