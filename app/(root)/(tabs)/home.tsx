import React, { useState } from "react";
import { Text, ScrollView, View, Pressable } from "react-native";
import ReactNativeModal from "react-native-modal";

import CustomButton from "@/components/CustomButton";

const Home = () => {
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const onSignUpPress = async () => {
    setVerification({
      ...verification,
      state: "pending",
    });
  };
  return (
    <ScrollView>
      <Pressable
        className="mb-6 mt-10"
        // title={"Sign Up"}
        onPress={onSignUpPress}
      >
        <Text>Press</Text>
      </Pressable>
      <ReactNativeModal
        isVisible={verification.state === "pending"}
        onDismiss={() => console.log("Modal dismissed")}
      >
        <View className="min-h-[300px] w-5/6 self-center rounded-2xl bg-[#0A1322] p-10">
          <Text className="text-center text-3xl text-[#D0D4DA]">
            Verification
          </Text>
          <Text className="mt-2 px-4 text-center text-[#a4a7ac]">
            We've sent a verification code to your email
          </Text>
        </View>
      </ReactNativeModal>
    </ScrollView>
  );
};

export default Home;
