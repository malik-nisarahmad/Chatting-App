// components/CustomKeyboardView.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function CustomKeyboardView({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // <- Ansdroid ignores "height"
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // <- ensures scrollable space
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}