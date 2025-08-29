// home.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Chatlist from '../../components/Chatlist';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebaseConfig';

interface User {
  id: string;
  username: string;
  photoURL?: string | null;
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  /* ───────────────  LIVE USERS LISTENER  ─────────────── */
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, 'users'), where('userId', '!=', user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: User[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as User));
        setUsers(list);
        setLoading(false);
      },
      (err) => {
        console.error('Users listener error:', err);
        setLoading(false);
      }
    );

    /* entrance animation */
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 10,
        useNativeDriver: true,
      }),
    ]).start();

    return unsub; // clean-up on unmount
  }, [user]);

  return (
    <LinearGradient colors={['#141e30', '#243b55']} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          paddingTop: hp(1.2),
          paddingHorizontal: wp(4),
        }}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <Chatlist users={users} />
        )}
      </Animated.View>

      {/* Floating Chat-Bot Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: hp(3),
          right: hp(3),
          width: hp(7),
          height: hp(7),
          borderRadius: hp(3.5),
          backgroundColor: '#00f2fe',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
        onPress={() => router.push('/botScreen')}
      >
        <Ionicons name="chatbubbles-outline" size={hp(3.2)} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}