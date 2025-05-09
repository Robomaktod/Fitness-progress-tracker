import { View, Text, Touchable, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const Welcome = () => {
  return (
    <SafeAreaView className='flex-1 bg-[#020611] items-center'>
      <Text>Welcome</Text>
      <Pressable
        className=''
        onPress={()=>router.replace("/(auth)/register")}
      >
        <Text className='text-white'>Skip</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Welcome