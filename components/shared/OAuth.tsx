import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";

import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";

import CustomButton from "./CustomButton";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);

    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(root)/(tabs)/home");
      return;
    }

    Alert.alert(result.success ? "Success" : "Error", result.message);
  };

  return (
    <CustomButton
      className="flex flex-row items-center justify-center rounded-lg border border-purple-500/50 bg-transparent px-4 py-3 font-medium text-white transition-all duration-300 hover:border-purple-500"
      title="Sign up with Google"
      isGradientActive={false}
      IconLeft={() => (
        <Image
          source={icons.google}
          resizeMode="contain"
          className="mr-4 size-8"
        />
      )}
      onPress={handleGoogleSignIn}
    />
  );
};

export default OAuth;
