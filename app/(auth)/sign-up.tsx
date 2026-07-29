import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StatusBar, Alert } from "react-native";
import ReactNativeModal from "react-native-modal";

import CustomButton from "@/components/shared/CustomButton";
import Divider from "@/components/shared/Divider";
import GradientText from "@/components/shared/GradientText";
import InputField from "@/components/shared/InputField";
import OAuth from "@/components/shared/OAuth";
import { icons, images } from "@/constants";

const SignUp = () => {
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isAuthLoaded } = useAuth();
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

  const handleFullReset = (message?: string) => {
    console.log(
      `handleFullReset called. ${message || ""} Resetting state to default.`,
    );
    setForm({ email: "", password: "", confirmPassword: "" });
    setVerification({ state: "default", error: "", code: "" });
    setShowSuccessModal(false);
  };

  useEffect(() => {
    if (isAuthLoaded && verification.state === "default") {
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
              // await performSignOut();
              handleFullReset("Signed out to restart signup.");
            },
          },
        ],
      );
    }
  }, [isAuthLoaded, verification.state]);

  useEffect(() => {
    if (
      isAuthLoaded &&
      (verification.state === "pendingVerification" ||
        verification.state === "failedVerification")
    ) {
      console.log(
        "Global sign-out or session invalidation detected during active flow. Resetting UI.",
      );
      handleFullReset(
        "Session invalidated or user signed out globally during flow.",
      );
    }
  }, [isAuthLoaded, verification.state]);

  const onSignUpPress = async () => {
    if (!isSignUpLoaded) return;
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    // if (isSignedIn) {
    //   Alert.alert("Session Active", "An active session was found. Please sign out if you wish to create a new account.", [ { text: "Go to App", onPress: () => router.replace("/(root)/(tabs)/home") }, { text: "Sign Out & Restart Signup", onPress: async () => { await performSignOut(); handleFullReset("Signed out via prompt in onSignUpPress."); } }, { text: "Cancel", style: "cancel" } ]);
    //   return;
    // }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ code: "", error: "", state: "pendingVerification" });
    } catch (err: any) {
      console.error("Clerk SignUp Create Error (raw object):", err);
      const clerkError = err.errors?.[0];
      const errorMessage =
        clerkError?.longMessage ||
        clerkError?.message ||
        "Could not start the sign up process.";
      Alert.alert("Sign Up Error", errorMessage);
      setVerification({
        ...verification,
        state: "default",
        error: errorMessage,
      });
    }
  };

  const onVerifyPress = async () => {
    if (!isSignUpLoaded || !signUp) {
      Alert.alert("Error", "Sign-up process is not ready. Please try again.");
      return;
    }

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (
        signUpAttempt.status === "complete" &&
        signUpAttempt.createdSessionId
      ) {
        await setActive({ session: signUpAttempt.createdSessionId });
        console.log(
          "Clerk session activated, createdSessionId:",
          signUpAttempt.createdSessionId,
        );

        // const userPayload: ApiCreateUserPayload = {
        //   clerk_user_id: signUpAttempt.createdUserId as string, // Clerk should provide this
        //   email: signUpAttempt.emailAddress || form.email,
        //   // Add other fields if available and needed by backend
        //   full_name: signUpAttempt.firstName ? `${signUpAttempt.firstName || ''} ${signUpAttempt.lastName || ''}`.trim() : undefined,
        //   // avatar_url: signUpAttempt.imageUrl,
        // };

        // createUserInBackend(userPayload, {
        //   onSuccess: (backendUser) => { // backendUser is of type ApiUser (or whatever your mutation returns)
        //     console.log('User synced/created in backend via mutation:', backendUser.clerk_user_id);
        //     setVerification({ code: "", error: "", state: "success" }); // Clear code and error on success
        //   },
        //   onError: (error: any) => { // Error type from apiClient
        //     console.error("Backend User Sync Error (mutation):", error.status, error.message, error.data);
        //     Alert.alert(
        //       "Account Finalization Issue",
        //       `Your account is verified, but syncing details failed: ${error.message}. You can proceed, but some features might be limited.`
        //     );
        //     setVerification({ code: "", error: "", state: "success" }); // Still a Clerk auth success
        //   }
        // });
      } else {
        console.warn(
          "Clerk Verification Status (not 'complete'):",
          signUpAttempt.status,
          signUpAttempt,
        );
        setVerification({
          ...verification, // Keep code for retry
          state: "failedVerification",
          error:
            "Verification was not successful. Status: " + signUpAttempt.status,
        });
      }
    } catch (err: any) {
      console.error(
        "Clerk Verification Error (onVerifyPress catch):",
        JSON.stringify(err, null, 2),
      );
      const clerkError = err.errors?.[0];
      // ... (your existing detailed error handling for session_exists, form_code_incorrect, etc.)
      if (
        clerkError?.code === "session_exists" ||
        clerkError?.code === "identifier_already_signed_in"
      ) {
        Alert.alert(
          "Existing Session",
          clerkError.longMessage ||
            "Another session is active. Please sign out and try the sign-up process again.",
          [
            {
              text: "Sign Out & Start Over",
              onPress: async () => {
                // await performSignOut();
                handleFullReset("Signed out due to session_exists on verify.");
                Alert.alert(
                  "Signed Out",
                  "Please try creating your account again.",
                );
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setVerification({
                  ...verification,
                  state: "failedVerification",
                  error: clerkError.longMessage,
                });
              },
            },
          ],
        );
        setVerification({
          ...verification, // Keep code
          state: "failedVerification",
          error:
            clerkError.longMessage ||
            "An existing session is preventing verification.",
        });
      } else if (clerkError?.code === "form_code_incorrect") {
        setVerification({
          ...verification,
          state: "failedVerification",
          error: clerkError.longMessage || "Incorrect code.",
        });
      } else {
        setVerification({
          ...verification,
          state: "failedVerification",
          error: clerkError?.longMessage || "Verification error.",
        });
      }
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
        <View className="mx-8 flex-1 rounded-xl border border-purple-500/20 bg-black/30 p-10 backdrop-blur-sm">
          <Text className="my-4 self-center text-2xl text-white">
            Create Account
          </Text>
          <InputField
            labelStyle="text-white"
            label="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text.trim() })}
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
            title={"Sign Up"}
            onPress={onSignUpPress}
            disabled={!isSignUpLoaded || !isAuthLoaded}
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
              containerStyle="border-2 border-b-2 border-[#D0D4DA] focus:border-indigo-400 my-3"
              keyboardType="number-pad"
              maxLength={6}
              value={verification.code}
              onChangeText={(text) =>
                setVerification({
                  ...verification,
                  code: text.replace(/[^0-9]/g, ""),
                  error: "",
                })
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
              title={"Verify Code"}
              onPress={onVerifyPress}
              disabled={!isSignUpLoaded || verification.code.length !== 6}
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
              Your email has been successfully verified. Welcome aboard!
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
