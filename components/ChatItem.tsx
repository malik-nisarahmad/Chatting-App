import { useAuth } from '@/context/authContext';
import { db } from '@/firebaseConfig';
import { getRoomId } from '@/utils/comman';
import { router } from 'expo-router';
import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ChatItemProps {
  item: any;
  noBorder?: boolean;
}

export default function ChatItem({ item, noBorder }: ChatItemProps) {
  const { user } = useAuth();
  const [lastMessage, setLastMessage] = useState<string>('');
  const [lastMessageTime, setLastMessageTime] = useState<string>('');

  useEffect(() => {
    if (!user || !item?.userId) return;
    const roomId = getRoomId(user.userId, item.userId);
    const messagesRef = collection(doc(db, 'rooms', roomId), 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const msg = snapshot.docs[0].data();
        setLastMessage(msg.text || '');

        if (msg.createdAt?.toDate) {
          const date = msg.createdAt.toDate();
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedTime = 
            ((hours + 11) % 12 + 1) + ':' + 
            (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
          setLastMessageTime(formattedTime);
        } else {
          setLastMessageTime('');
        }
      }
    });

    return () => unsub();
  }, [user, item]);

  const openChatRoom = () => {
    router.push({ pathname: '/chatRoom', params: item });
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between items-center pb-2 gap-3 mx-4 rounded-lg mb-4 ${
        noBorder ? '' : 'border-b border-neutral-200'
      }`}
    >
      <Image
        source={
          item.photoURL
            ? { uri: item.photoURL }
            : require('../assets/images/1.jpg')}
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
      />
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-white"
          >
            {item?.username}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            {lastMessageTime || '—'}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
          numberOfLines={1}
        >
          {lastMessage || 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
