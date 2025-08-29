// chatRoom.tsx  (GLM-4 AI-assist edition + keyboard fix)
import ChatRoomHeader from '@/components/ChatRoomHeader';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import MessageList from '@/components/MessageList';
import { useAuth } from '@/context/authContext';
import { db } from '@/firebaseConfig';
import { getRoomId } from '@/utils/comman';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { askAI } from '../../api/glm4';

const CLOUD_NAME = 'durtmkadv';
const UPLOAD_PRESET = 'chatApp';

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const { user } = useAuth();
  const textRef = useRef('');
  const inputRef = useRef<TextInput>(null);

  if (!item || !user) return null;
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [aiWorking, setAiWorking] = useState(false);

  /* ---------- FIREBASE ---------- */
  useEffect(() => {
    createRoomIfNotExists();
    const itemUserId = Array.isArray(item?.userId) ? item.userId[0] : item?.userId;
    const roomId = getRoomId(user?.userId, itemUserId);
    const docRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(docRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) =>
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data(), roomId })))
    );
    return unsub;
  }, []);

  const createRoomIfNotExists = async () => {
    const itemUserId = Array.isArray(item?.userId) ? item.userId[0] : item?.userId;
    const roomId = getRoomId(user?.userId, itemUserId);
    await setDoc(doc(db, 'rooms', roomId), { roomId, createdAt: Timestamp.fromDate(new Date()) });
  };

  /* ---------- TEXT ---------- */
  const handleSendMessage = async () => {
    const msg = textRef.current.trim();
    if (!msg) return;
    const itemUserId = Array.isArray(item?.userId) ? item.userId[0] : item?.userId;
    const roomId = getRoomId(user.userId, itemUserId);
    const ref = collection(doc(db, 'rooms', roomId), 'messages');
    textRef.current = '';
    inputRef.current?.clear();
    await addDoc(ref, {
      userId: user.uid,
      text: msg,
      senderName: user.username || user.email,
      createdAt: Timestamp.fromDate(new Date()),
      roomId,
    });
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  /* ---------- AI ASSIST ---------- */
  const handleAIAssist = async () => {
    if (aiWorking) return;
    setAiWorking(true);
    try {
      const history = messages
        .slice(-40)
        .map((m) => ({
          role: m.userId === user.uid ? 'user' : 'assistant',
          content: m.text || '',
        }));
      const prompt = `You are ${user.username || 'the user'}. Continue the conversation in their exact voice. Do NOT mention you are AI.`;
      history.push({ role: 'user', content: prompt });
      const aiReply = await askAI(history);
      const itemUserId = Array.isArray(item?.userId) ? item.userId[0] : item?.userId;
      const roomId = getRoomId(user.userId, itemUserId);
      const ref = collection(doc(db, 'rooms', roomId), 'messages');
      await addDoc(ref, {
        userId: user.uid,
        text: aiReply,
        senderName: user.username || user.email,
        createdAt: Timestamp.fromDate(new Date()),
        roomId,
      });
      inputRef.current?.focus(); // 🔑
    } catch (err: any) {
      Alert.alert('Auto-reply error', err.message);
    } finally {
      setAiWorking(false);
    }
  };

  /* ---------- IMAGE ---------- */
   const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed');

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!res.canceled && res.assets?.[0]?.uri) {
      await sendFile(res.assets[0].uri, 'image');
      // ↓ bring keyboard (and layout) back
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }

  /* ---------- AUDIO ---------- */
  const handleRecordAndSend = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Mic permission required');
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    Alert.alert('Recording…', 'Tap OK to stop & send', [
      {
        text: 'Stop & Send',
        onPress: async () => {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          if (uri) await sendFile(uri, 'audio');
        },
      },
    ]);
  };

  const sendFile = async (localUri: string, type: 'image' | 'audio') => {
    try {
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const form = new FormData();
      form.append(
        'file',
        `data:${type === 'image' ? 'image/jpeg' : 'audio/mp4'};base64,${base64}`
      );
      form.append('upload_preset', UPLOAD_PRESET);
      form.append('resource_type', type === 'image' ? 'image' : 'video');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        { method: 'POST', body: form }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error('Upload failed');

      const itemUserId = Array.isArray(item?.userId) ? item.userId[0] : item?.userId;
      const roomId = getRoomId(user.userId, itemUserId);
      const ref = collection(doc(db, 'rooms', roomId), 'messages');
      await addDoc(ref, {
        userId: user.uid,
        [type === 'image' ? 'imageUrl' : 'audioUrl']: data.secure_url,
        text: '',
        senderName: user.username || user.email,
        createdAt: Timestamp.fromDate(new Date()),
        roomId,
      });
      inputRef.current?.focus(); // 🔑
    } catch (err: any) {
      Alert.alert('Upload error', err.message || 'Send failed');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!messages?.[0]?.roomId) return;
    await deleteDoc(doc(db, 'rooms', messages[0].roomId, 'messages', id));
  };

  /* ---------- Animation ---------- */
  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = withRepeat(withTiming(1, { duration: 8000 }), -1, true);
  }, []);
  const animatedGradient = useAnimatedStyle(() => ({
    transform: [{ scale: 1.05 + anim.value * 0.02 }],
  }));

  return (
    <CustomKeyboardView>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[StyleSheet.absoluteFill, animatedGradient]}>
          <LinearGradient
            colors={['#141E30', '#243B55', '#0F2027']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={{ flex: 1 }}>
          <ChatRoomHeader user={item} router={router} />
          <View className="h-3 border-b border-neutral-300 opacity-30" />
          <View style={{ flex: 1 }}>
            <MessageList messages={messages} onDelete={handleDeleteMessage} />
          </View>

          {/* Remove the inner KeyboardAvoidingView here */}
          <View className="pb-3 bg-transparent">
            <View
              className="flex-row items-center mx-3 bg-white/90 border border-neutral-200 rounded-full pl-3 pr-1"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 5 },
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <TouchableOpacity onPress={handlePickImage}>
                <Ionicons name="image-outline" size={hp(2.5)} color="#00f2fe" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRecordAndSend}>
                <Ionicons name="mic-outline" size={hp(2.5)} color="#00f2fe" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAIAssist} disabled={aiWorking}>
                <Ionicons
                  name={aiWorking ? 'hourglass' : 'return-down-forward'}
                  size={hp(2.5)}
                  color={aiWorking ? '#999' : '#00f2fe'}
                />
              </TouchableOpacity>

              <TextInput
                ref={inputRef}
                placeholder="Type message..."
                placeholderTextColor="#666"
                className="flex-1 text-base text-black mx-1"
                multiline
                numberOfLines={2}
                onChangeText={(val) => (textRef.current = val)}
              />

              <TouchableOpacity className="p-2.5" onPress={handleSendMessage}>
                <Ionicons name="send" size={hp(2.8)} color="#00f2fe" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}