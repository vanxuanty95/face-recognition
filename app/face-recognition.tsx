import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert, ActivityIndicator} from 'react-native';
import {Camera, useCameraDevice, PhotoFile} from 'react-native-vision-camera';
import {useRouter} from 'expo-router';
import {useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import axiosInstance from '../utils/axiosInstance'; // Import your Axios instance
import { useAuth } from '@/context/AuthContext';

const {width, height} = Dimensions.get('window');

const FaceRecognitionScreen = () => {
    const router = useRouter();
    const { qrData } = useLocalSearchParams(); // Retrieve the QR code data
    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const device = useCameraDevice('front');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const cameraRef = useRef<Camera>(null); // Reference to the Camera component
    const {user, token} = useAuth(); // Use the user and token from AuthContext

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

    useEffect(() => {
        console.log('Scanned QR Data:', qrData); // Log the QR code data for debugging
    }, [qrData]);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                setIsLoading(true); // Start loading

                // Parse qrData to extract id and date
                const [classDetailId, date] = (qrData as string).split(',');

                const photo: PhotoFile = await cameraRef.current.takePhoto({
                    quality: 0.8, // Adjust quality as needed
                    skipMetadata: true,
                });

                // Read the image file as Base64
                const base64Image = await FileSystem.readAsStringAsync(photo.path, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Upload the image to the backend
                const response = await axiosInstance.post('/api/attendances/store-face-image', {
                    image: base64Image,
                    classDetailId, // Pass the extracted class ID
                    date,    // Pass the extracted date
                    studentId: user?.id, // Pass the user ID
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });

                // Alert.alert('Photo Uploaded', 'Your photo has been uploaded successfully.');
                console.log('Photo uploaded:', response.data);

                // Navigate to a success screen or perform additional actions
                router.push('./checkin-success');
            } catch (error) {
                console.error('Failed to take photo:', error);
                Alert.alert('Error', 'Failed to take photo. Please try again.');
            } finally {
                setIsLoading(false); // Stop loading
            }
        }
    };

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
                ref={cameraRef} // Attach the reference to the Camera component
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true} // Enable photo capture
            />
            <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
                <View style={styles.faceOutline}>
                    <Ionicons name="person-outline" size={150} color="#3B5998"/>
                </View>
                <Text style={styles.instructionText}>
                    Position your face within the outline
                </Text>
                <TouchableOpacity style={[styles.captureButton, {opacity: isLoading ? 0.7 : 1}]} onPress={takePicture} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="camera" size={30} color="white"/>
                    )}
                </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
                disabled={isLoading} // Disable close button while loading
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
        width: 350, // Increased width
        height: 650, // Increased height
        borderWidth: 2,
        borderColor: '#3B5998',
        borderRadius: 350, // Adjusted to match the new size
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
        backgroundColor: '#3B5998',
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
