import { Entypo, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ChatRoomHeader({ user, router }: { user: any; router: any }) {
  const handleBackPress = () => {
    router.back();
  };

  // Animation values
  const avatarScale = useSharedValue(0.8);
  const nameOpacity = useSharedValue(0);

  useEffect(() => {
    avatarScale.value = withSpring(1, { damping: 10 });
    nameOpacity.value = withDelay(100, withSpring(1));
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
  }));

  return (
    <Stack.Screen
      options={{
        title: '',
        headerShadowVisible: false,
        headerStyle: { height: hp(9) },
        headerBackground: () => (
          <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
              <Entypo name="chevron-left" size={hp(3.5)} color="#fff" />
            </TouchableOpacity>
            <Animated.View style={avatarStyle}>
              <View style={styles.avatarShadow}>
                <Image
                  source={
                    user.photoURL
                      ? { uri: user.photoURL }
                      : require('../assets/images/1.jpg')}
                  style={styles.avatar}
                />
              </View>
            </Animated.View>
            <Animated.View style={nameStyle}>
              <Text style={styles.username}>{user?.username}</Text>
            </Animated.View>
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="call" size={hp(2.8)} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="videocam" size={hp(2.8)} color="#fff" />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: hp(4.5),
    width: hp(4.5),
    borderRadius: 100,
  },
  avatarShadow: {
    shadowColor: '#00f2fe',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 100,
  },
  username: {
    fontSize: hp(2.3),
    fontWeight: '600',
    color: '#fff',
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
