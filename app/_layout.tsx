import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthContextProvider, useAuth } from '../context/authContext';
import "../global.css";

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated === 'undefined') return;

        const inApp = segments[0] === '(app)';
        const inAuth = ['signIn', 'signUp'].includes(segments[0] || '');

        if (isAuthenticated === true && !inApp) {
            router.replace('/(app)/home');
        } else if (isAuthenticated === false && !inAuth) {
            router.replace('/signIn');
        }
    }, [isAuthenticated, segments]);

    return <Slot />;
};

export default function RootLayout() {
    return (
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    );
}