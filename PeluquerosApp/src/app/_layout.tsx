import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="login"
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="inicio" />
    </Stack>
  );
}