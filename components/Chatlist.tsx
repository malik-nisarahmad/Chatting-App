// Chatlist.tsx
import React from 'react';
import { FlatList, View } from 'react-native';
import ChatItem from './ChatItem';

interface User {
  id: string;
  username: string;
  photoURL?: string | null;
}

interface ChatlistProps {
  users: User[];
}

export default function Chatlist({ users }: ChatlistProps) {
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ paddingVertical: 25 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <ChatItem noBorder={index + 1 === users.length} item={item} />}
      />
    </View>
  );
}