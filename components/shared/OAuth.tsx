import { Alert, Image, Text, View } from "react-native";

import { icons } from "@/constants";

import CustomButton from "./CustomButton";
import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);

    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(root)/(tabs)/home");
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
          className="size-8 mr-4"
        />
      )}
      onPress={handleGoogleSignIn}
    />
  );
};

export default OAuth;