import React from 'react';
import {Button, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {useRouter} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

const ScanButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push('./scan-qr')}>
            <Ionicons name="scan-outline" size={24} color="white"/>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
        </TouchableOpacity>
    );
};

export default ScanButton;


const styles = StyleSheet.create({
    scanButton: {
        backgroundColor: '#3B5998',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scanTitle: {
        paddingHorizontal: 5,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});