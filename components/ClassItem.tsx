import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const ClassItem = ({name, code, time, isCheckin}: { name: any, code: any, time: any, isCheckin: any }) => (


    <View style={styles.item}>
        <View style={styles.iconContainer}>
            <Ionicons name="school-outline" size={24} color="#3B5998"/>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.className}>{name}</Text>
            <Text style={styles.classInfo}>code {code} • {time}</Text>
        </View>
        {isCheckin === true ? (
            <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#3B5998"/>
            </View>
        ) : (<View></View>)}

    </View>
);

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    iconContainer: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    className: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    classInfo: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default ClassItem;