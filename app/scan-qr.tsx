import React, {useState, useEffect} from "react";
import {View, StyleSheet, Alert, Text} from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from "react-native-vision-camera";
import {useRouter} from 'expo-router';

const ScanQrScreen = () => {
    const router = useRouter();

    const [hasPermission, setHasPermission] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [active, setActive] = useState(true);
    const device = useCameraDevice("back");
    const codeScanner = useCodeScanner({
        codeTypes: ["qr"],
        onCodeScanned: (codes) => {
            if (active) {
                setActive(false);
                console.log(`onCodeScanned value`, codes[0].value);
                onRead(codes[0].value);
            }
        },
    });

    useEffect(() => {
        // exception case
        setRefresh(!refresh);
    }, [device, hasPermission]);

    useEffect(() => {
        const requestCameraPermission = async () => {
            const permission = await Camera.requestCameraPermission();
            console.log("Camera.requestCameraPermission ", permission);
            setHasPermission(permission === "granted");
        };

        requestCameraPermission();

        //if it is idle for 15 secs, it will be closed
        setTimeout(() => onRead(null), 15 * 1000);
    }, []);

    if (device == null || !hasPermission) {
        return (
            <View style={styles.page2}>
                <Text style={{backgroundColor: "white"}}>
                    Camera not available or not permitted
                </Text>
            </View>
        );
    }

    const onRead = (e: any) => {
        Alert.alert(
            'QR Code Scanned!',
            e.data,
            [
                {
                    text: 'Check In',
                    onPress: () => router.push('./face-recognition'),
                },
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            {cancelable: false}
        );
    };

    return (
        <View style={styles.container}>
            <Camera
                codeScanner={codeScanner}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={active}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#fff',
    },
    page2: {
        flex: 1,
        position: "absolute",
        top: 0,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    backHeader: {
        backgroundColor: "#00000090",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "2%",
        height: "5%",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    footer: {
        backgroundColor: "#00000090",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10%",
        height: "20%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default ScanQrScreen;