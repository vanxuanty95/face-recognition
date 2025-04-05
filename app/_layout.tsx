import {Stack} from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: 'Login', headerShown: false}}/>
            <Stack.Screen name="home" options={{title: 'Home', headerShown: false}}/>
            <Stack.Screen name="scan-qr" options={{title: 'Scan QR Code', headerShown: false}}/>
            <Stack.Screen name="face-recognition" options={{title: 'Face Recognition',  headerShown: false}}/>
            <Stack.Screen name="checkin-success" options={{title: 'Check-in Success',  headerShown: false}}/>
        </Stack>
    );
}
