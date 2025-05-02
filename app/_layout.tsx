import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="index" options={{title: 'Login', headerShown: false}}/>
                <Stack.Screen name="home" options={{title: 'Home', headerShown: false}}/>
                <Stack.Screen name="scan-qr" options={{title: 'Scan QR Code', headerShown: false}}/>
                <Stack.Screen name="face-recognition" options={{title: 'Face Recognition',  headerShown: false}}/>
                <Stack.Screen name="checkin-success" options={{title: 'Check-in Success',  headerShown: false}}/>
            </Stack>
        </AuthProvider>
    );
}