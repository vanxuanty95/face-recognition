import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    studentId: string;
    name: string; // Add studentName to the User interface
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    loadTokenAndUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>({
        id: '',
        studentId: '',
        name: "Who's here", // Default value for studentName
    });
    const [token, setToken] = useState<string | null>(null);

    const login = async (user: User, token: string) => {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setToken(token);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        setUser(null);
        setToken(null);
    };

    const loadTokenAndUser = async () => {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    };

    useEffect(() => {
        loadTokenAndUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loadTokenAndUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
