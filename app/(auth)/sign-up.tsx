import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StatusBar, Alert } from "react-native";
import ReactNativeModal from "react-native-modal";

import CustomButton from "@/components/shared/CustomButton";
import Divider from "@/components/shared/Divider";
import GradientText from "@/components/shared/GradientText";
import InputField from "@/components/shared/InputField";
import OAuth from "@/components/shared/OAuth";
import { icons, images } from "@/constants";
import {
  getClerkErrorCode,
  getClerkErrorMessage,
  syncBackendProfile,
} from "@/lib/auth";

type VerificationState =
  | "default"
  | "pendingVerification"
  | "failedVerification"
  | "success";

const SignUp = () => {
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isAuthLoaded, isSignedIn, signOut } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [profileSyncWarning, setProfileSyncWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verification, setVerification] = useState<{
    state: VerificationState;
    error: string;
    code: string;
  }>({
    state: "default",
    error: "",
    code: "",
  });

  const handleFullReset = useCallback((message?: string) => {
    if (message) {
      console.info(message);
    }

    setForm({ email: "", password: "", confirmPassword: "" });
    setVerification({ state: "default", error: "", code: "" });
    setProfileSyncWarning("");
    setShowSuccessModal(false);
  }, []);

  useEffect(() => {
    if (!isAuthLoaded || !isSignedIn || verification.state !== "default") {
      return;
    }

    Alert.alert(
      "Already Signed In",
      "You are already signed in. To create a new account, please sign out first.",
      [
        {
          text: "Go to App",
          onPress: () => router.replace("/(root)/(tabs)/home"),
          style: "cancel",
        },
        {
          text: "Sign Out & Restart",
          onPress: async () => {
            await signOut();
            handleFullReset("Signed out to restart signup.");
          },
        },
      ],
    );
  }, [handleFullReset, isAuthLoaded, isSignedIn, signOut, verification.state]);

  const onSignUpPress = async () => {
    if (!isSignUpLoaded || isSubmitting) return;

    const email = form.email.trim().toLowerCase();

    if (isSignedIn) {
      Alert.alert(
        "Already Signed In",
        "Please sign out before creating a new account.",
      );
      return;
    }

    if (!email || !form.password || !form.confirmPassword) {
      Alert.alert("Missing Details", "Please complete all sign-up fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setProfileSyncWarning("");

      await signUp.create({
        emailAddress: email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setForm((currentForm) => ({ ...currentForm, email }));
      setVerification({ code: "", error: "", state: "pendingVerification" });
    } catch (err: unknown) {
      const errorMessage = getClerkErrorMessage(
        err,
        "Could not start the sign up process.",
      );

      console.error("Clerk sign-up create failed:", err);
      Alert.alert("Sign Up Error", errorMessage);
      setVerification((currentVerification) => ({
        ...currentVerification,
        state: "default",
        error: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isSignUpLoaded || !signUp || isVerifying) {
      Alert.alert("Error", "Sign-up process is not ready. Please try again.");
      return;
    }

    if (verification.code.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);
      setProfileSyncWarning("");

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (
        signUpAttempt.status === "complete" &&
        signUpAttempt.createdSessionId
      ) {
        try {
          await syncBackendProfile({
            clerkUserId: signUpAttempt.createdUserId,
            email: signUpAttempt.emailAddress || form.email,
          });
        } catch (profileSyncError) {
          console.error("Backend profile sync failed:", profileSyncError);
          setProfileSyncWarning(
            "Your email is verified, but profile sync failed. Some profile details may be unavailable until the backend is reachable.",
          );
        }

        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ code: "", error: "", state: "success" });
      } else {
        console.warn(
          "Clerk Verification Status (not 'complete'):",
          signUpAttempt.status,
          signUpAttempt,
        );
        setVerification((currentVerification) => ({
          ...currentVerification,
          state: "failedVerification",
          error:
            "Verification was not successful. Status: " + signUpAttempt.status,
        }));
      }
    } catch (err: unknown) {
      const clerkErrorCode = getClerkErrorCode(err);
      const errorMessage = getClerkErrorMessage(err, "Verification error.");

      console.error("Clerk verification failed:", err);

      if (
        clerkErrorCode === "session_exists" ||
        clerkErrorCode === "identifier_already_signed_in"
      ) {
        Alert.alert(
          "Existing Session",
          errorMessage ||
            "Another session is active. Please sign out and try again.",
          [
            {
              text: "Go to App",
              onPress: () => router.replace("/(root)/(tabs)/home"),
              style: "cancel",
            },
            {
              text: "Sign Out & Start Over",
              onPress: async () => {
                await signOut();
                handleFullReset("Signed out due to session_exists on verify.");
              },
            },
          ],
        );
        setVerification((currentVerification) => ({
          ...currentVerification,
          state: "failedVerification",
          error: errorMessage,
        }));
      } else if (clerkErrorCode === "form_code_incorrect") {
        setVerification((currentVerification) => ({
          ...currentVerification,
          state: "failedVerification",
          error: errorMessage || "Incorrect code.",
        }));
      } else {
        setVerification((currentVerification) => ({
          ...currentVerification,
          state: "failedVerification",
          error: errorMessage,
        }));
      }
    } finally {
      setIsVerifying(false);
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
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="my-8 items-center">
          <Image source={images.mainIcon} className="mb-2 size-20" />
          <GradientText>NeonPulse Fit</GradientText>
        </View>
        <View className="mx-6 flex-1 rounded-xl border border-purple-500/20 bg-black/30 p-6">
          <Text className="my-4 self-center text-2xl text-white">
            Create Account
          </Text>
          <InputField
            labelStyle="text-white"
            label="Email"
            value={form.email}
            onChangeText={(text) =>
              setForm({ ...form, email: text.trim().toLowerCase() })
            }
            keyboardType="email-address"
            autoCapitalize="none"
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
          {verification.error && verification.state === "default" && (
            <Text className="mt-2 text-center text-xs text-red-400">
              {verification.error}
            </Text>
          )}
          <CustomButton
            className="mb-6 mt-10"
            title={isSubmitting ? "Creating Account..." : "Sign Up"}
            onPress={onSignUpPress}
            disabled={!isSignUpLoaded || !isAuthLoaded || isSubmitting}
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
        </View>

        <ReactNativeModal
          isVisible={
            verification.state === "pendingVerification" ||
            verification.state === "failedVerification"
          }
          backdropOpacity={0.7}
          animationIn="zoomIn"
          animationOut="zoomOut"
          onModalHide={() => {
            if (verification.state === "success" && !showSuccessModal) {
              setShowSuccessModal(true);
            }
          }}
          onBackdropPress={() => {
            if (
              verification.state === "pendingVerification" ||
              verification.state === "failedVerification"
            ) {
              Alert.alert(
                "Cancel Verification?",
                "Do you want to go back to the sign-up form?",
                [
                  {
                    text: "Yes, Start Over",
                    onPress: () => handleFullReset("Backdrop press cancel."),
                    style: "destructive",
                  },
                  { text: "No, Continue Verifying", style: "cancel" },
                ],
              );
            }
          }}
        >
          <View className="min-h-[300px] w-full self-center rounded-2xl bg-[#0A1322] p-6 shadow-xl">
            <Text className="text-center text-2xl font-semibold text-[#D0D4DA]">
              Verify Your Email
            </Text>
            <Text className="mt-3 px-4 text-center text-sm text-[#a4a7ac]">
              We've sent a 6-digit verification code to:
            </Text>
            <Text className="mt-1 px-4 text-center text-sm font-medium text-white">
              {form.email}
            </Text>
            <InputField
              label="Verification Code"
              labelStyle="text-white mt-6 text-center"
              inputStyle="text-white text-center text-2xl tracking-[10px] font-semibold"
              containerStyle="my-3 border-2 border-[#D0D4DA]"
              keyboardType="number-pad"
              maxLength={6}
              value={verification.code}
              onChangeText={(text) =>
                setVerification((currentVerification) => ({
                  ...currentVerification,
                  code: text.replace(/[^0-9]/g, ""),
                  error: "",
                }))
              }
              autoFocus={true}
            />
            {verification.error &&
              verification.state === "failedVerification" && (
                <Text className="mt-2 text-center text-xs text-red-400">
                  {verification.error}
                </Text>
              )}
            <CustomButton
              className="mt-8"
              title={isVerifying ? "Verifying..." : "Verify Code"}
              onPress={onVerifyPress}
              disabled={
                !isSignUpLoaded || isVerifying || verification.code.length !== 6
              }
            />
            <CustomButton
              className="mt-3 bg-transparent"
              title={"Cancel & Restart Signup"}
              textVariant="secondary"
              onPress={() =>
                handleFullReset("Manual cancel from verification modal.")
              }
              isGradientActive={false}
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal
          isVisible={showSuccessModal}
          animationIn="bounceInUp"
          animationOut="bounceOutDown"
        >
          <View className="items-center rounded-2xl bg-[#0A1322] p-10 shadow-xl">
            <Image
              source={icons.success}
              className="mb-5 h-24 w-24"
              resizeMode="contain"
            />
            <Text className="mt-2 text-center text-3xl font-bold text-white">
              Verified!
            </Text>
            <Text className="mt-3 px-4 text-center text-base text-[#a4a7ac]">
              {profileSyncWarning ||
                "Your email has been successfully verified. Welcome aboard!"}
            </Text>
            <CustomButton
              className="mt-12 w-full"
              title={"Let's Go!"}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(root)/(tabs)/home");
              }}
            />
          </View>
        </ReactNativeModal>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUp;
