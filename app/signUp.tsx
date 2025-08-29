import CustomKeyboardView from '@/components/CustomKeyboardView';
import { Feather, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Loading from '../components/Loading';
import { useAuth } from '../context/authContext';

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef('');
  const passwordRef = useRef('');
  const usernameRef = useRef('');

  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
      Alert.alert('Sign Up', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    const response = await register(emailRef.current, passwordRef.current, usernameRef.current);
    setLoading(false);

    if (!response.success) {
      Alert.alert('Sign Up', response.msg);
    }
  };

  return (
    <CustomKeyboardView>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#141e30', '#243b55']}
        style={{ flex: 1 }}
      >
        <View style={{ paddingTop: hp(8), paddingHorizontal: wp(6), flex: 1 }}>
          {/* Logo */}
          <Animated.View entering={FadeInUp.duration(800)} style={{ alignItems: 'center', marginBottom: hp(4) }}>
            <Image
              style={{ height: hp(22), width: hp(22) }}
              resizeMode="contain"
              source={require('../assets/images/login.png')}
            />
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeInUp.delay(200).duration(600)}
            style={{
              fontSize: hp(4),
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              letterSpacing: 1,
              marginBottom: hp(4),
            }}
          >
            Create Account
          </Animated.Text>

          {/* Input Fields */}
          <View style={{ gap: hp(2) }}>
            {[
              { icon: <Feather name="user" size={hp(2.7)} color="#fff" />, placeholder: 'Enter Username', ref: usernameRef },
              { icon: <Octicons name="mail" size={hp(2.7)} color="#fff" />, placeholder: 'Email Address', ref: emailRef },
              { icon: <Octicons name="lock" size={hp(2.7)} color="#fff" />, placeholder: 'Password', ref: passwordRef, secure: true },
            ].map((field, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(200 + index * 150).duration(600)}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={{
                    height: hp(6.5),
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 15,
                    paddingHorizontal: wp(4),
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                  }}
                >
                  {field.icon}
                  <TextInput
                    placeholder={field.placeholder}
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    secureTextEntry={field.secure}
                    onChangeText={(val) => (field.ref.current = val)}
                    style={{
                      flex: 1,
                      marginLeft: wp(3),
                      fontSize: hp(2),
                      fontWeight: '600',
                      color: '#fff',
                    }}
                  />
                </LinearGradient>
              </Animated.View>
            ))}
          </View>

          {/* Button */}
          <View style={{ marginTop: hp(4) }}>
            {loading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Loading size={hp(5)} />
              </View>
            ) : (
              <TouchableOpacity onPress={handleRegister} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#ff512f', '#dd2476']}
                  style={{
                    height: hp(6.5),
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#ff512f',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: hp(2.5),
                      fontWeight: 'bold',
                      letterSpacing: 1,
                    }}
                  >
                    Sign Up
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Link */}
          <Animated.View
            entering={FadeInUp.delay(700).duration(600)}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: hp(3),
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: hp(1.8), fontWeight: '500' }}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push('/signIn')}>
              <Text style={{ color: '#ff8c69', fontSize: hp(1.8), fontWeight: '600', marginLeft: 5 }}>
                Sign In
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </LinearGradient>
    </CustomKeyboardView>
  );
}
