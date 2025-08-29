// components/HomeHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/authContext';
import { db } from '../firebaseConfig';
import { CLOUD_NAME, UPLOAD_PRESET } from '../utils/cloudinary';
import blurhash from '../utils/comman';

const ios = Platform.OS === 'ios';

export default function HomeHeader() {
  const { user, updateUserProfile, logout } = useAuth();
  const { top } = useSafeAreaInsets();
  const [uploading, setUploading] = useState(false);

  /* ------------- Animation ------------- */
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

  /* ------------- Cloudinary + Firestore ------------- */
  const uploadToCloudinary = async (localUri: string) => {
    setUploading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const form = new FormData();
      form.append('file', `data:image/jpeg;base64,${base64}`);
      form.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: form }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error('Upload failed');

      // 1️⃣ Update auth profile
      await updateUserProfile({ photoURL: data.secure_url });

      // 2️⃣ Update Firestore users collection (single source of truth)
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'users', user!.uid), {
        photoURL: data.secure_url,
      });
    } catch (err: any) {
      Alert.alert('Upload error', err.message);
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted')
      return Alert.alert('Permission needed', 'Enable gallery access in settings.');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri)
      await uploadToCloudinary(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted')
      return Alert.alert('Permission needed', 'Enable camera access in settings.');
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri)
      await uploadToCloudinary(result.assets[0].uri);
  };

  const showActionSheet = () => {
    Alert.alert(
      'Profile picture',
      '',
      [
        { text: 'Open Camera', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ paddingTop: ios ? top : top + 10, height: hp(9) }}>
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.headerContent}>
        <Animated.View style={avatarStyle}>
          <TouchableOpacity onPress={showActionSheet} disabled={uploading}>
            <View style={styles.avatarShadow}>
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Image
                  style={styles.avatar}
                  source={
                    user?.photoURL
                      ? { uri: user.photoURL }
                      : require('../assets/images/favicon.png')
                  }
                  placeholder={{ blurhash }}
                  transition={500}
                />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={nameStyle}>
          <Text style={styles.username}>Chats</Text>
        </Animated.View>

        <TouchableOpacity style={styles.iconButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={hp(2.8)} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    height: hp(4.5),
    aspectRatio: 1,
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
    fontSize: hp(2.5),
    fontWeight: '600',
    color: '#fff',
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});