// app/(app)/botScreen.tsx
import { Entypo, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { askAI } from '../../api/glm4';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebaseConfig';
const BOT_THREAD = 'bot_thread';

export default function BotScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const textRef = useRef('');
  const inputRef = useRef<TextInput>(null);

  /* ---------- FIREBASE ---------- */
  useEffect(() => {
    const q = query(collection(db, 'botChats', BOT_THREAD, 'messages'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) =>
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, []);

  /* ---------- SEND ---------- */
  const sendMessage = async () => {
    const txt = textRef.current.trim();
    if (!txt) return;
    textRef.current = '';
    inputRef.current?.clear();
    try {
      await addDoc(collection(db, 'botChats', BOT_THREAD, 'messages'), {
        userId: user?.uid,
        text: txt,
        senderName: user?.username || 'You',
        createdAt: serverTimestamp(),
      });

      // GLM-4
      setLoading(true);
      const reply = await askAI([
        { role: 'system', content: 'You are a helpful assistant. Reply concisely.' },
        { role: 'user', content: txt },
      ]);
      await addDoc(collection(db, 'botChats', BOT_THREAD, 'messages'), {
        userId: '__BOT__',
        text: reply,
        senderName: 'GLM-4 Bot',
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      Alert.alert('Bot error', err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={{ flex: 1 }}>
      {/* HEADER */}
      <Stack.Screen
        options={{
          title: '',
          headerShadowVisible: false,
          headerStyle: { height: hp(9) },
          headerBackground: () => (
            <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={StyleSheet.absoluteFill} />
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
              <Entypo name="chevron-left" size={hp(3.5)} color="#fff" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={{ fontSize: hp(2.3), fontWeight: '600', color: '#fff' }}>Assistant</Text>
          ),
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* MESSAGES */}
        <FlatList
          data={messages}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: item.userId === '__BOT__' ? 'flex-start' : 'flex-end', marginBottom: hp(1.5), marginHorizontal: wp(3) }}>
              <LinearGradient
                colors={item.userId === '__BOT__' ? ['#ffffff', '#f0f0f0'] : ['#00F260', '#0575E6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.bubble,
                  item.userId === '__BOT__' ? styles.botBubble : styles.myBubble,
                ]}
              >
                <Text style={{ color: item.userId === '__BOT__' ? '#222' : '#fff', fontSize: hp(2) }}>
                  {item.text}
                </Text>
              </LinearGradient>
            </View>
          )}
        />

        {/* INPUT BAR (same as chatRoom.tsx) */}
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
            <TextInput
              ref={inputRef}
              placeholder="Ask GLM-4…"
              placeholderTextColor="#666"
              className="flex-1 text-base text-black mx-1"
              multiline
              numberOfLines={2}
              onChangeText={(v) => (textRef.current = v)}
            />
            <TouchableOpacity className="p-2.5" onPress={sendMessage} disabled={loading}>
              <Ionicons name="send" size={hp(2.8)} color={loading ? '#999' : '#00f2fe'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '75%',
    paddingVertical: hp(1.4),
    paddingHorizontal: hp(2),
    borderRadius: 26,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  myBubble: {
    borderTopRightRadius: 8,
  },
  botBubble: {
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});