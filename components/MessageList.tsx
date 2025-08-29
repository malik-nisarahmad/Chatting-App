import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react';
import { ScrollView } from 'react-native';
import { useAuth } from '../context/authContext';
import { db } from '../firebaseConfig';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: any[];
}

export default function MessageList({ messages }: MessageListProps) {
  const { user } = useAuth(); // Get current user from auth context

  const handleDeleteMessage = async (messageId: string) => {
      if (!messages || messages.length === 0) {
        console.error('No messages available');
        return;
      }

      const firstMessage = messages[0];
      if (!firstMessage || !firstMessage.roomId) {
        console.error('First message or roomId is undefined');
        return;
      }

      try {
        const messageRef = doc(db, 'rooms', firstMessage.roomId, 'messages', messageId);
        await deleteDoc(messageRef);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 10 }}>
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          currentUser={user}
          onDelete={handleDeleteMessage}
        />
      ))}
    </ScrollView>
  );
}