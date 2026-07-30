import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image } from "react-native";

import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";

import CustomButton from "./CustomButton";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);

    if (result.success || result.code === "session_exists") {
      router.replace("/(root)/(tabs)/home");
      return;
    }

    Alert.alert("Error", result.message);
  };

  return (
    <CustomButton
      className="flex flex-row items-center justify-center rounded-lg border border-purple-500/50 bg-transparent px-4 py-3 font-medium text-white"
      title="Continue with Google"
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
