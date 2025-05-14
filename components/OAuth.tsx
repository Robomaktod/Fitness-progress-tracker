import { Image } from "react-native";

import { icons } from "@/constants";

import CustomButton from "./CustomButton";

const OAuth = () => {
  const handleGoogleSignIn = async () => {};

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
    />
  );
};

export default OAuth;
