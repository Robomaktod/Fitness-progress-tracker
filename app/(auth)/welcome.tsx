import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex-1 items-center bg-[#020611]">
      <StatusBar backgroundColor="#020611" barStyle="light-content" />

      <View className="flex w-full flex-row justify-between px-4">
        <Text className="text-2xl font-bold text-[#1ED2EE]">
          Step {activeIndex + 1} of 3
        </Text>
        <Pressable
          className="flex items-end justify-end"
          onPress={() => router.replace("/(auth)/sign-up")}
        >
          <Text className="text-[#9BA2AE]">Skip</Text>
        </Pressable>
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="mx-4 h-1 w-12 rounded-full bg-slate-800" />}
        activeDot={<View className="mx-4 h-1 w-12 rounded-full bg-[#1ED2EE]" />}
        onIndexChanged={(index) => {
          setActiveIndex(index);
        }}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex-1">
            <Text className="text-white">{item.title}</Text>

            <Text className="text-white">{item.description}</Text>
          </View>
        ))}
      </Swiper>

      <View className="mb-4 w-full px-10">
        <CustomButton
          title={isLastSlide ? "Get Started" : "Next"}
          className="mx-12r"
          onPress={() => {
            // eslint-disable-next-line no-unused-expressions
            isLastSlide
              ? router.replace("/(auth)/sign-up")
              : swiperRef.current?.scrollBy(1);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
