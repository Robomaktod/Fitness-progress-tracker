import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
  Platform,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          {label && <Text className={`mb-3 text-base font-medium text-gray-300 ${labelStyle}`}>{label}</Text>}
          <View
            className={`relative flex flex-row items-center justify-start rounded-lg border-purple-500/50 bg-gray-900/60 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`ml-4 h-6 w-6 ${iconStyle}`} />
            )}
            <TextInput
              className={`flex-1 rounded-lg p-4 text-[15px] text-white ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default InputField;