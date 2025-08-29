// import CustomKeyboardView from '@/components/CustomKeyboardView';
// import { Octicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   Animated,
//   Image,
//   Pressable,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import Loading from '../components/Loading';
// import { useAuth } from '../context/authContext';

// export default function SignIn() {
//   const router = useRouter();
//   const { login } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const emailRef = useRef("");
//   const passwordRef = useRef("");

//   // Animation refs
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         bounciness: 10,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const handleLogin = async () => {
//     if (!emailRef.current || !passwordRef.current) {
//       Alert.alert("Sign In", "Please fill all fields.");
//       return;
//     }
//     setLoading(true);
//     const response = await login(emailRef.current, passwordRef.current);
//     setLoading(false);
//     if (!response.success) {
//       Alert.alert("Sign In", response.msg);
//       return;
//     }
//   };

//   return (
//     <CustomKeyboardView>
//       <StatusBar barStyle="light-content" />
//       <LinearGradient
//         colors={["#4F46E5", "#9333EA", "#EC4899"]}
//         style={{ flex: 1 }}
//       >
//         <Animated.View
//           style={{
//             flex: 1,
//             paddingTop: hp(8),
//             paddingHorizontal: wp(5),
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           }}
//         >
//           {/* Logo */}
//           <View className="items-center mb-8">
//             <Image
//               style={{
//                 height: hp(22),
//                 width: hp(22),
//                 borderRadius: 999,
//                 borderWidth: 3,
//                 borderColor: "rgba(255,255,255,0.2)",
//               }}
//               resizeMode="cover"
//               source={require("../assets/images/login.png")}
//             />
//           </View>

//           {/* Title */}
//           <Text
//             className="font-bold text-center text-white tracking-wider mb-6"
//             style={{ fontSize: hp(4.5), textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 6 }}
//           >
//             Welcome Back
//           </Text>

//           {/* Input Fields */}
//           <View className="gap-5">
//             <View
//               style={{
//                 height: hp(6.5),
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingHorizontal: 15,
//                 borderRadius: 20,
//                 backgroundColor: "rgba(255,255,255,0.15)",
//                 borderWidth: 1,
//                 borderColor: "rgba(255,255,255,0.2)",
//                 shadowColor: "#000",
//                 shadowOpacity: 0.15,
//                 shadowRadius: 6,
//                 elevation: 4,
//               }}
//             >
//               <Octicons name="mail" size={hp(2.5)} color="white" />
//               <TextInput
//                 onChangeText={(value) => (emailRef.current = value)}
//                 placeholder="Email Address"
//                 placeholderTextColor={"rgba(255,255,255,0.6)"}
//                 className="flex-1 font-semibold text-white ml-3"
//                 style={{ fontSize: hp(2) }}
//               />
//             </View>

//             <View
//               style={{
//                 height: hp(6.5),
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingHorizontal: 15,
//                 borderRadius: 20,
//                 backgroundColor: "rgba(255,255,255,0.15)",
//                 borderWidth: 1,
//                 borderColor: "rgba(255,255,255,0.2)",
//                 shadowColor: "#000",
//                 shadowOpacity: 0.15,
//                 shadowRadius: 6,
//                 elevation: 4,
//               }}
//             >
//               <Octicons name="lock" size={hp(2.5)} color="white" />
//               <TextInput
//                 secureTextEntry
//                 onChangeText={(value) => (passwordRef.current = value)}
//                 placeholder="Password"
//                 placeholderTextColor={"rgba(255,255,255,0.6)"}
//                 className="flex-1 font-semibold text-white ml-3"
//                 style={{ fontSize: hp(2) }}
//               />
//             </View>

//             <Text
//               style={{ fontSize: hp(1.8) }}
//               className="text-right text-white font-semibold"
//             >
//               Forgot Password?
//             </Text>
//           </View>

//           {/* Button */}
//           <View className="mt-8">
//             {loading ? (
//               <View className="flex-1 justify-center items-center">
//                 <Loading size={hp(5)} />
//               </View>
//             ) : (
//               <TouchableOpacity
//                 onPress={handleLogin}
//                 style={{
//                   height: hp(6.8),
//                   borderRadius: 20,
//                   overflow: "hidden",
//                   shadowColor: "#fff",
//                   shadowOpacity: 0.3,
//                   shadowRadius: 10,
//                   elevation: 5,
//                 }}
//               >
//                 <LinearGradient
//                   colors={["#6366F1", "#A855F7", "#EC4899"]}
//                   style={{
//                     flex: 1,
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Text
//                     className="text-white font-bold tracking-wider"
//                     style={{ fontSize: hp(2.5) }}
//                   >
//                     Sign In
//                   </Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Sign Up link */}
//           <View className="flex-row items-center justify-center gap-2 mt-6">
//             <Text
//               style={{ fontSize: hp(1.9) }}
//               className="font-semibold text-white"
//             >
//               Don't have an account?
//             </Text>
//             <Pressable onPress={() => router.push("/signUp")}>
//               <Text
//                 style={{ fontSize: hp(1.9) }}
//                 className="font-semibold text-yellow-300"
//               >
//                 Sign Up
//               </Text>
//             </Pressable>
//           </View>
//         </Animated.View>
//       </LinearGradient>
//     </CustomKeyboardView>
//   );
// }
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Loading from '../components/Loading';
import { useAuth } from '../context/authContext';

export default function SignUp() {
 const router= useRouter();
  const {login} = useAuth();
  const [loading, setLoading] =useState(false);
  const emailRef=useRef("");
  const passwordRef=useRef("");

  const handleLogin=async ()=>{
    if(!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Please fill all fields.");
      return;
    }
    setLoading(true);
    const response=await login(emailRef.current, passwordRef.current);
    setLoading(false);
    if(!response.success){
      Alert.alert("Sign In", response.msg);
      return;
    }
    
  }

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
            Sign In
          </Animated.Text>

          {/* Input Fields */}
          <View style={{ gap: hp(2) }}>
            {[
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
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
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
                    Sign In
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
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push('/signUp')}>
              <Text style={{ color: '#ff8c69', fontSize: hp(1.8), fontWeight: '600', marginLeft: 5 }}>
                Sign Up
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </LinearGradient>
    </CustomKeyboardView>
  );
}
