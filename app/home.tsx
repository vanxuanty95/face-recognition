import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ClassItem from '../components/ClassItem';
import ScanButton from '../components/ScanButton';
import { fetchClasses } from '../api/apiService';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const [classes, setClasses] = useState<any[]>([]);
    const { user, token, logout } = useAuth(); // Use the updated useAuth
    const router = useRouter(); // Use router for navigation
    const studentNameValue = user?.name || "Who's here"; // Default to "Who's here" if studentName is null

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    const handlePrevious = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 1);
            fetchClassesForDate(newDate);
            return newDate;
        });
    };

    const handleNext = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 1);
            fetchClassesForDate(newDate);
            return newDate;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const fetchClassesForDate = async (date: Date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            const studentValue = user?.id || ''; // Ensure studentId is a string
            const tokenValue = token || ''; // Ensure token is a string
            const classes = await fetchClasses(formattedDate, studentValue, tokenValue); // Now correctly typed as any[]
            console.log('Fetched classes:', classes);
            setClasses(classes);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setClasses([]); // Fallback to empty list on error
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            console.log('HomeScreen focused or reloaded');
            fetchClassesForDate(currentDate); // Fetch classes whenever the screen is focused
        }, [currentDate, user, token])
    );

    useEffect(() => {
        console.log('HomeScreen mounted or reloaded');
        fetchClassesForDate(currentDate);
    }, [currentDate, user, token]);

    const handleLogout = async () => {
        await logout(); // Clear user data and token
        router.replace('/'); // Navigate back to the login page
    };

    const renderItem = ({ item }: { item: any }) => (
        <ClassItem
            name={item.name}
            code={item.code}
            time={item.time}
            isCheckin={item.isCheckin}
        />
    );

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY }]
                    }
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{studentNameValue}</Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={24} color="#3B5998" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateNavigator}>
                    <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color="#3B5998" />
                    </TouchableOpacity>
                    <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
                    {!isToday(currentDate) && (
                        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
                            <Ionicons name="chevron-forward" size={24} color="#3B5998" />
                        </TouchableOpacity>
                    )}
                    {isToday(currentDate) && (
                        <View style={styles.navButton} />
                    )}
                </View>

                <FlatList
                    data={classes}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    style={styles.flatList}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.scanButtonContainer}>
                    <ScanButton />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3B5998',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        width: width * 0.9,
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        color: '#3B5998',
        marginLeft: 5,
    },
    dateNavigator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    navButton: {
        padding: 5,
        width: 34,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3B5998',
    },
    flatList: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 10,
    },
    scanButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});

export default HomeScreen;
