import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

const {width, height} = Dimensions.get('window');

const FaceRecognitionScreen = () => {
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState(false);
    const device = useCameraDevice('front');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const requestCameraPermission = async () => {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === 'granted');
        };

        requestCameraPermission();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
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
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
            <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
                <View style={styles.faceOutline}>
                    <Ionicons name="person-outline" size={150} color="#8A2BE2"/>
                </View>
                <Text style={styles.instructionText}>
                    Position your face within the outline
                </Text>
                <TouchableOpacity style={styles.captureButton} onPress={ () => router.push('./checkin-success')}>
                    <Ionicons name="camera" size={30} color="white"/>
                </TouchableOpacity>
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
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceOutline: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#8A2BE2',
        borderRadius: 125,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    instructionText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#8A2BE2',
        justifyContent: 'center',
        alignItems: 'center',
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

export default FaceRecognitionScreen;
