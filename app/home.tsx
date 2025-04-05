import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import ClassList from '../components/ClassList';
import ClassItem from '../components/ClassItem';
import ScanButton from '../components/ScanButton';

const dummyData = [
    {id: '1', name: 'Mathematics', code: 25, time: '09:00 AM', isCheckin: false},
    {id: '2', name: 'Physics', code: 20, time: '11:00 AM', isCheckin: true},
    {id: '3', name: 'Chemistry', code: 22, time: '02:00 PM', isCheckin: false},
    {id: '4', name: 'Mathematics', code: 25, time: '09:00 AM', isCheckin: false},
    {id: '5', name: 'Physics', code: 20, time: '11:00 AM', isCheckin: true},
    {id: '6', name: 'Chemistry', code: 22, time: '02:00 PM', isCheckin: false},
    {id: '7', name: 'Mathematics', code: 25, time: '09:00 AM', isCheckin: true},
    {id: '8', name: 'Physics', code: 20, time: '11:00 AM', isCheckin: false},
    {id: '9', name: 'Chemistry', code: 22, time: '02:00 PM', isCheckin: true},
    {id: '10', name: 'Mathematics', code: 25, time: '09:00 AM', isCheckin: false},
    {id: '11', name: 'Physics', code: 20, time: '11:00 AM', isCheckin: false},
    {id: '12', name: 'Chemistry', code: 22, time: '02:00 PM', isCheckin: true},
    // ... add more items as needed
];

const {width} = Dimensions.get('window');

const HomeScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const [classes, setClasses] = useState([]);

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
        return date.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
    };

    const handlePrevious = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 1);
            fetchClasses(newDate);
            return newDate;
        });
    };

    const handleNext = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 1);
            fetchClasses(newDate);
            return newDate;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const fetchClasses = (date: Date) => {
        const dummy = [
            {id: '10', name: 'Mathematics', code: 25, time: '09:00 AM', isCheckin: false},
            {id: '11', name: 'Physics', code: 20, time: '11:00 AM', isCheckin: false},
            {id: '12', name: 'Chemistry', code: 22, time: '02:00 PM', isCheckin: true},
            // ... add more items as needed
        ];
        if (date.getDate() == 5){
            setClasses(dummyData);
        }else{
            setClasses(dummy);
        }
    };

    useEffect(() => {
        fetchClasses(currentDate);
    }, []);


    const renderItem = ({item}: { item: any }) => (
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
                        transform: [{translateY}]
                    }
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Who's Here</Text>
                    <Text style={styles.subtitle}>Your Classes</Text>
                </View>

                <View style={styles.dateNavigator}>
                    <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color="#3B5998"/>
                    </TouchableOpacity>
                    <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
                    {!isToday(currentDate) && (
                        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
                            <Ionicons name="chevron-forward" size={24} color="#3B5998"/>
                        </TouchableOpacity>
                    )}
                    {isToday(currentDate) && (
                        <View style={styles.navButton}/>
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
                    <ScanButton/>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3B5998', // Deep purple background
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
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    scanButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    flatList: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 10,
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
});

export default HomeScreen;
