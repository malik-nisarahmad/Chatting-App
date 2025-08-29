import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/authContext';

export default function Index() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until we know the auth state
    if (isAuthenticated === undefined) return;

    if (isAuthenticated) {
      router.replace('/(app)/home'); // Redirect to home if authenticated
    } else {
      router.replace('/signIn');     // Redirect to sign-in if not authenticated
    }
  }, [isAuthenticated]);

  // Show a loading spinner while determining the auth state
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#00f2fe" />
    </View>
  );
}