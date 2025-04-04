import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="scan-qr" options={{ title: 'Scan QR Code' }} />
      <Stack.Screen name="face-recognition" options={{ title: 'Face Recognition' }} />
      <Stack.Screen name="checkin-success" options={{ title: 'Check-in Success' }} />
    </Stack>
  );
}
