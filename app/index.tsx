import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, ActivityIndicator} from 'react-native';
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const {width, height} = Dimensions.get('window');

class Star extends React.Component<{ size: any, top: any, left: any }> {
    render() {
        let {size, top, left} = this.props;
        return (
            <View style={[styles.star, {width: size, height: size, top, left}]}/>
        );
    }
}

const StarBackground = () => {
    const stars = [];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 3 + 1;
        const top = Math.random() * height;
        const left = Math.random() * width;
        stars.push(<Star key={i} size={size} top={top} left={left}/>);
    }

    return <View style={styles.starContainer}>{stars}</View>;
};

const LoginScreen = () => {
    const router = useRouter();
    const { login } = useAuth(); // Use the login function from AuthContext
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = async () => {
        try {
            setIsLoading(true); // Start loading
            const bodyData = { studentId, password }; // Prepare login data

            // Define the expected response type
            interface LoginResponse {
                token: string;
                user: {
                    id: string;
                    studentId: string;
                };
            }

            const response = await axiosInstance.post<LoginResponse>('/api/auth/login', bodyData); // Call login API
            console.log('Login successful:', response.data);

            // Store authentication token and user data
            const { token, user } = response.data;

            await login(user, token); // Call login function from AuthContext

            // Navigate to the home screen
            router.replace('/home');
        } catch (error: any) {
            console.error('Login failed:', error.message);
            if (error.response) {
                console.error('Error response data:', error.response.data); // Log server response
            }
            alert('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000000', '#000033']}
                style={StyleSheet.absoluteFillObject}
            />
            <StarBackground/>
            <Animated.View
                style={[
                    styles.formContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            {
                                translateY: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Text style={styles.title}>Who's Here</Text>
                <Text style={styles.subtitle}>Please sign in to your account</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#aaa"
                        value={studentId}
                        onChangeText={setStudentId}
                        editable={!isLoading} // Disable input while loading
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        editable={!isLoading} // Disable input while loading
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon} disabled={isLoading}>
                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666"/>
                    </TouchableOpacity>
                </View>

                {/* <TouchableOpacity style={styles.forgotPassword} disabled={isLoading}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity> */}

                <TouchableOpacity 
                    style={[
                        styles.loginButton, 
                        { opacity: isLoading ? 0.7 : 1 } // Dim button when loading
                    ]} 
                    onPress={handleLogin} 
                    disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity disabled={isLoading}>
                        <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    starContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    star: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 50,
    },
    formContainer: {
        width: width * 0.9,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    inputIcon: {
        marginRight: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPassword: {
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    // forgotPasswordText: {
    //     color: '#3b5998',
    //     fontSize: 16,
    //     fontWeight: 'bold',
    // },
    loginButton: {
        backgroundColor: '#3b5998',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signupText: {
        color: '#666',
    },
    signupLink: {
        color: '#3b5998',
        fontWeight: 'bold',
    },
});

export default LoginScreen;