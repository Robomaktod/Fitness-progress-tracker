import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
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
      className={className}
    >
      <View className="my-2 w-full">
        {label && (
          <Text
            className={`mb-3 text-base font-medium text-gray-300 ${labelStyle ?? ""}`}
          >
            {label}
          </Text>
        )}
        <View
          className={`relative flex flex-row items-center justify-start rounded-lg border border-purple-500/50 bg-gray-900/60 ${containerStyle ?? ""}`}
        >
          {icon && (
            <Image
              source={icon}
              className={`ml-4 h-6 w-6 ${iconStyle ?? ""}`}
            />
          )}
          <TextInput
            className={`flex-1 rounded-lg p-4 text-left text-[15px] text-white ${inputStyle ?? ""}`}
            secureTextEntry={secureTextEntry}
            {...props}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InputField;
