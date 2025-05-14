import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { View, Text, ScrollView, Image, StatusBar } from "react-native";

import CustomButton from "@/components/CustomButton";
import Divider from "@/components/Divider";
import GradientText from "@/components/GradientText";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { images } from "@/constants";

const SignIn = () => {
  const OnSignInPress = async () => {
    // Handle sign-in logic here
  };

  return (
    <LinearGradient
      className="flex-1 transition-all duration-300 "
      colors={["#111827", "#3b0764", "#172554"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar backgroundColor={"#020611"} barStyle={"light-content"} />
      <ScrollView className="flex-1">
        <View className="items-center my-8">
          <Image source={images.mainIcon} className="size-20 mb-2" />
          <GradientText>FitnessTracker</GradientText>
        </View>

        <View className="bg-black/30 mx-8 flex-1 rounded-xl p-10 backdrop-blur-sm border border-purple-500/20">
          <Text className="text-2xl my-4 self-center text-white">
            Welcome Back 👋
          </Text>
          <InputField labelStyle="text-white" label="Email" />

          <InputField
            containerStyle="mb-10"
            labelStyle="text-white "
            label="Password"
            secureTextEntry
          />

          <CustomButton className="mb-6" title={"Log In"} />

          <View className="flex flex-row self-center mb-6">
            <Text className="text-[#D0D4DA]">Don't have an account? </Text>
            <Link
              href="/sign-up"
              className="text-lg text-center text-general-200"
            >
              <GradientText bgVariant="default">Sign Up</GradientText>
            </Link>
          </View>

          <View className="flex flex-row self-center mb-4">
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
