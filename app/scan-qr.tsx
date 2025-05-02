import React, {useState, useEffect, useRef, useCallback} from "react";
import {View, StyleSheet, Alert, Text, TouchableOpacity, Animated, Dimensions} from 'react-native';
import {Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera";
import {useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

const ScanQrScreen = () => {
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState(false);
    const [active, setActive] = useState(true);
    const device = useCameraDevice("back");
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const onReadRef = useRef<((data: string | null) => void) | null>(null);

    const onRead = useCallback((data: string | null) => {
        Alert.alert(
            'QR Code Scanned!',
            data || 'No data',
            [
                {
                    text: 'Check In',
                    onPress: () => {
                        if (data) {
                            router.push({
                                pathname: './face-recognition',
                                params: { qrData: data }, // Pass the scanned data as a query parameter
                            });
                        }
                    },
                },
                { text: 'Cancel', onPress: () => setActive(true), style: 'cancel' },
            ],
            { cancelable: false }
        );
    }, [router]);

    useEffect(() => {
        onReadRef.current = onRead;
    }, [onRead]);

    const codeScanner = useCodeScanner({
        codeTypes: ["qr"],
        onCodeScanned: (codes) => {
            if (active && codes.length > 0) {
                setActive(false);
                console.log(`onCodeScanned`, codes);
                console.log(`onCodeScanned value`, codes[0].value);
                onReadRef.current?.(codes[0].value?codes[0].value:'');
            }
        },
    });

    useEffect(() => {
        const requestCameraPermission = async () => {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === "granted");
        };

        requestCameraPermission();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            onReadRef.current?.(null);
        }, 15 * 100000);
        return () => clearTimeout(timer);
    }, []);

    if (device == null || !hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    Camera not available or not permitted
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                codeScanner={codeScanner}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={active}
            />
            <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
                <View style={styles.scanArea}>
                    <Animated.View
                        style={[
                            styles.scanLine,
                            {
                                transform: [
                                    {
                                        translateY: scanLineAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 246],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                </View>
                <Text style={styles.instructionText}>
                    Position the QR code within the frame to scan
                </Text>
            </Animated.View>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
            >
                <Ionicons name="close" size={30} color="white"/>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#3B5998',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanLine: {
        width: 230,
        height: 2,
        backgroundColor: '#3B5998',
        position: 'absolute',
        top: 0,
    },
    instructionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 40,
    },
    errorText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
});

export default ScanQrScreen;
