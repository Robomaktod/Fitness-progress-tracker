import { useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, ScrollView, StatusBar, Alert } from "react-native";
import ReactNativeModal from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import Divider from "@/components/Divider";
import GradientText from "@/components/GradientText";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <LinearGradient
      className="flex-1"
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
            Create Account
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

          <InputField
            labelStyle="text-white "
            label="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            secureTextEntry
          />

          <CustomButton
            className="mb-6 mt-10"
            title={"Sign Up"}
            onPress={onSignUpPress}
          />

          <View className="mb-6 flex flex-row self-center">
            <Text className="text-[#D0D4DA]">Already have an account? </Text>
            <Link
              href="/sign-in"
              className="text-general-200 text-center text-lg"
            >
              <GradientText bgVariant="default">Sign In</GradientText>
            </Link>
          </View>

          <View className="mb-4 flex flex-row self-center">
            <Divider />
            <Text className="text-[#D0D4DA]">or</Text>
            <Divider />
          </View>
          <OAuth />

          <ReactNativeModal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") {
                setShowSuccessModal(true);
              }
            }}
          >
            <View className="min-h-[300px] w-5/6 self-center rounded-2xl bg-[#0A1322] p-10">
              <Text className="text-center text-3xl text-[#D0D4DA]">
                Verification
              </Text>
              <Text className="mt-2 px-4 text-center text-[#a4a7ac]">
                We've sent a verification code to your email
              </Text>
              <InputField
                label="Code"
                labelStyle="text-white mt-5"
                className="border-2 border-b-2 border-[#D0D4DA] text-[#D0D4DA]"
                keyboardType="numeric"
                value={verification.code}
                onChangeText={(text) =>
                  setVerification({ ...verification, code: text })
                }
              />
              {verification.error && (
                <Text className="mt-1 text-sm text-red-500">
                  {verification.error}
                </Text>
              )}
              <CustomButton
                className="mt-10"
                title={"Verify"}
                onPress={onVerifyPress}
              />
            </View>
          </ReactNativeModal>
              <Text className="mt-8 text-center text-3xl text-[#D0D4DA]">
                Verified
              </Text>
              <Text className="mt-2 px-4 text-center text-[#a4a7ac]">
                You have successfully verified your email
              </Text>
              <CustomButton
                className="mt-14"
                title={"Continue"}
                onPress={() => {
                  router.push("/(root)/(tabs)/home");
                }}
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUp;
