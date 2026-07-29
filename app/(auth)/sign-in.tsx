import { useSignIn } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useCallback } from "react";
import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";

import CustomButton from "@/components/shared/CustomButton";
import Divider from "@/components/shared/Divider";
import GradientText from "@/components/shared/GradientText";
import InputField from "@/components/shared/InputField";
import OAuth from "@/components/shared/OAuth";
import { images } from "@/constants";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      if (err.errors[0].code === "session_exists") {
        return router.replace("/(root)/(tabs)/home");
      }
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]);
  return (
    <LinearGradient
      className="flex-1 transition-all duration-300"
      colors={["#111827", "#3b0764", "#172554"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar backgroundColor={"#020611"} barStyle={"light-content"} />
      <ScrollView className="flex-1">
        <View className="my-8 items-center">
          <Image source={images.mainIcon} className="mb-2 size-20" />
          <GradientText>NeonPulse Fit</GradientText>
        </View>

        <View className="mx-8 flex-1 rounded-xl border border-purple-500/20 bg-black/30 p-10 backdrop-blur-sm">
          <Text className="my-4 self-center text-2xl text-white">
            Welcome Back 👋
          </Text>
          <InputField
            labelStyle="text-white"
            label="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          <InputField
            labelStyle="text-white"
            label="Password"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
          />

          <CustomButton
            className="mb-6 mt-10"
            title={"Log In"}
            onPress={onSignInPress}
          />

          <View className="mb-6 flex flex-row self-center">
            <Text className="text-[#D0D4DA]">Don't have an account? </Text>
            <Link
              href="/sign-up"
              className="text-general-200 text-center text-lg"
            >
              <GradientText bgVariant="default">Sign Up</GradientText>
            </Link>
          </View>

          <View className="mb-4 flex flex-row self-center">
            <Divider />
            <Text className="text-[#D0D4DA]">or</Text>
            <Divider />
          </View>

          <OAuth />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignIn;
