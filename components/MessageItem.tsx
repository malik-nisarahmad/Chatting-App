// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withDelay,
//     withSpring,
// } from "react-native-reanimated";
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from "react-native-responsive-screen";

// interface MessageItemProps {
//   message: any;
//   currentUser: any;
// }

// export default function MessageItem({ message, currentUser }: MessageItemProps) {
//   const isMyMessage = currentUser?.uid === message?.userId;

//   // Animation values
//   const scale = useSharedValue(0.8);
//   const opacity = useSharedValue(0);

//   useEffect(() => {
//     opacity.value = withDelay(50, withSpring(1, { damping: 15 }));
//     scale.value = withSpring(1, { damping: 15 });
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: scale.value }],
//       opacity: opacity.value,
//     };
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           flexDirection: "row",
//           marginBottom: hp(1.5),
//           marginHorizontal: wp(3),
//           justifyContent: isMyMessage ? "flex-end" : "flex-start",
//         },
//         animatedStyle,
//       ]}
//     >
//       <View style={{ maxWidth: wp(75) }}>
//         {isMyMessage ? (
//           <LinearGradient
//             colors={["#4facfe", "#00f2fe"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={[styles.bubble, styles.myBubble]}
//           >
//             <Text style={[styles.text, { color: "#fff" }]}>{message?.text}</Text>
//           </LinearGradient>
//         ) : (
//           <View style={[styles.bubble, styles.otherBubble]}>
//             <Text style={[styles.text, { color: "#333" }]}>{message?.text}</Text>
//           </View>
//         )}
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   bubble: {
//     paddingVertical: hp(1.2),
//     paddingHorizontal: wp(3),
//     borderRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   myBubble: {
//     borderTopRightRadius: 5,
//   },
//   otherBubble: {
//     backgroundColor: "rgba(255,255,255,0.85)",
//     borderTopLeftRadius: 5,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.05)",
//     backdropFilter: "blur(10px)",
//   },
//   text: {
//     fontSize: hp(2),
//     fontWeight: "500",
//   },
// });
// import { BlurView } from "expo-blur";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect } from "react";
// import { Pressable, StyleSheet, Text } from "react-native";
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withDelay,
//     withRepeat,
//     withSpring,
//     withTiming,
// } from "react-native-reanimated";
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from "react-native-responsive-screen";

// interface MessageItemProps {
//   message: any;
//   currentUser: any;
// }

// export default function MessageItem({ message, currentUser }: MessageItemProps) {
//   const isMyMessage = currentUser?.uid === message?.userId;

//   // Animation values
//   const scale = useSharedValue(0.8);
//   const opacity = useSharedValue(0);
//   const shimmer = useSharedValue(0);

//   useEffect(() => {
//     opacity.value = withDelay(50, withSpring(1, { damping: 15 }));
//     scale.value = withSpring(1, { damping: 12 });
//     shimmer.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//     opacity: opacity.value,
//   }));

//   const shimmerStyle = useAnimatedStyle(() => ({
//     opacity: 0.2 + 0.8 * shimmer.value,
//   }));

//   return (
//     <Animated.View
//       style={[
//         {
//           flexDirection: "row",
//           marginBottom: hp(1.5),
//           marginHorizontal: wp(3),
//           justifyContent: isMyMessage ? "flex-end" : "flex-start",
//         },
//         animatedStyle,
//       ]}
//     >
//       <Pressable
//         onPressIn={() => (scale.value = withSpring(0.95))}
//         onPressOut={() => (scale.value = withSpring(1))}
//         style={{ maxWidth: wp(75) }}
//       >
//         {isMyMessage ? (
//           <LinearGradient
//             colors={["#4facfe", "#00f2fe", "#43e97b"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={[styles.bubble, styles.myBubble]}
//           >
//             <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]} />
//             <Text style={[styles.text, { color: "#fff" }]}>{message?.text}</Text>
//           </LinearGradient>
//         ) : (
//           <BlurView intensity={40} tint="light" style={[styles.bubble, styles.otherBubble]}>
//             <Text style={[styles.text, { color: "#222" }]}>{message?.text}</Text>
//           </BlurView>
//         )}
//       </Pressable>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   bubble: {
//     paddingVertical: hp(1.4),
//     paddingHorizontal: wp(3.5),
//     borderRadius: 24,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   myBubble: {
//     borderTopRightRadius: 6,
//   },
//   otherBubble: {
//     borderTopLeftRadius: 6,
//   },
//   text: {
//     fontSize: hp(2),
//     fontWeight: "500",
//   },
// });

// components/MessageItem.tsx
// components/MessageItem.tsx  —  WhatsApp-style voice message
// components/MessageItem.tsx  —  WhatsApp-style voice message + debug
// components/MessageItem.tsx  (GLM-4 AI-ready)
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface MessageItemProps {
  message: any;
  currentUser: any;
  onDelete: (messageId: string) => void;
}

export default function MessageItem({ message, currentUser, onDelete }: MessageItemProps) {
  const isMyMessage = currentUser?.uid === message?.userId;
  const isAI = message.userId === '__AI__';

  /* ---------- Animation ---------- */
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(10);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(80, withSpring(1, { damping: 14 }));
    translateY.value = withSpring(0, { damping: 14 });
    scale.value = withSpring(1, { damping: 12 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  /* ---------- Long-press delete ---------- */
  const handleLongPress = () => {
    Alert.alert('Message Options', '', [
      { text: 'Delete', onPress: () => onDelete(message.id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  /* ---------- Render ---------- */
  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          marginBottom: hp(1.5),
          marginHorizontal: wp(3),
          justifyContent: isMyMessage || isAI ? 'flex-end' : 'flex-start',
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        onLongPress={handleLongPress}
      >
        {/* IMAGE */}
        {message?.imageUrl && (
          <View style={[styles.shadowWrap, { maxWidth: wp(70) }]}>
            <Image
              source={{ uri: message.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* VOICE MESSAGE */}
        {message?.audioUrl && (
          <VoiceBubble uri={message.audioUrl} isMyMessage={isMyMessage || isAI} />
        )}

        {/* TEXT */}
        {!message.imageUrl && !message.audioUrl && (
          <View style={[styles.shadowWrap, { maxWidth: wp(75) }]}>
            <LinearGradient
              colors={
                isAI
                  ? ['#8e2de2', '#4a00e0']      // AI purple
                  : isMyMessage
                  ? ['#00F260', '#0575E6']
                  : ['#ffffff', '#f0f0f0']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bubble, isMyMessage || isAI ? styles.myBubble : styles.otherBubble]}
            >
              <View style={styles.innerGlow} />
              <Text
                style={[
                  styles.text,
                  { color: isMyMessage || isAI ? '#fff' : '#222' },
                ]}
              >
                {message.text}
              </Text>
            </LinearGradient>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

/* ---------- WhatsApp-style voice bubble ---------- */
const VoiceBubble = ({ uri, isMyMessage }: { uri: string; isMyMessage: boolean }) => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { sound: s } = await Audio.Sound.createAsync(
        { uri },
        { volume: 1, shouldPlay: false },
        (status) => {
          if (mounted && status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) s.stopAsync();
          }
        }
      );
      setSound(s);
    })();
    return () => {
      mounted = false;
      sound?.unloadAsync();
    };
  }, [uri]);

  const togglePlay = async () => {
    if (!sound) return;
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
  };

  const format = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progress = duration ? position / duration : 0;

  return (
    <View style={[styles.shadowWrap, { maxWidth: wp(70) }]}>
      <LinearGradient
        colors={isMyMessage ? ['#00F260', '#0575E6'] : ['#ffffff', '#f0f0f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.voiceBubble, isMyMessage ? styles.myBubble : styles.otherBubble]}
      >
        <View style={styles.innerGlow} />
        <View style={styles.voiceRow}>
          <TouchableOpacity onPress={togglePlay}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color={isMyMessage ? '#fff' : '#222'}
            />
          </TouchableOpacity>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text
            style={[styles.duration, { color: isMyMessage ? '#fff' : '#222' }]}
          >
            {format(duration)}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 9,
  },
  bubble: {
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(4),
    borderRadius: 26,
    overflow: 'hidden',
  },
  myBubble: {
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  otherBubble: {
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 26,
  },
  text: {
    fontSize: hp(2),
    fontWeight: '500',
  },
  image: {
    width: wp(70),
    height: wp(50),
    borderRadius: 12,
  },
  voiceBubble: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: wp(45),
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  sliderFill: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  duration: {
    fontSize: hp(1.6),
    fontWeight: '600',
  },
});