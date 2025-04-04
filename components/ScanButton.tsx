import React from 'react';
import {Button, TouchableOpacity, StyleSheet} from 'react-native';
import {useRouter} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

const ScanButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="scan-outline" size={24} color="white"/>
            <Button title="Scan QR Code" onPress={() => router.push('/scan-qr')}/>
        </TouchableOpacity>
    );
};

export default ScanButton;


const styles = StyleSheet.create({
    scanButton: {
        backgroundColor: '#8A2BE2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});