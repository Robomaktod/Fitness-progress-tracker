import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { FoodLogItemData } from '@/types';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';


interface FoodListItemProps {
  item: FoodLogItemData;
  onItemPress?: (item: FoodLogItemData) => void;
}

const FoodListItem: React.FC<FoodListItemProps> = ({ item, onItemPress }) => {
  const Icon = item.iconProvider === "Ionicons" ? Ionicons : FontAwesome5;
  return (
    <Pressable
      className="mb-2 flex-row items-center rounded-lg bg-dark-100/70 p-3"
      onPress={() => onItemPress?.(item)}
      style={({ pressed }) => [
        { opacity: onItemPress ? (pressed ? 0.7 : 1) : 1 },
      ]}
      disabled={!onItemPress}
    >
      <View
        className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${item.iconBgClassName}`}
      >
        <Icon
          name={item.iconName as any}
          size={18}
          className={item.iconColorClassName}
          color="#E2DFD2"
        />
      </View>
      <View className="flex-1">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-base font-medium text-white">{item.name}</Text>
          <Text className={`${item.iconColorClassName} text-sm font-semibold`}>
            {item.calories}
          </Text>
        </View>
        <View className="flex-row ">
          <Text className="text-xs text-gray-100">P: {item.macros.protein}    F: {item.macros.fat}    C: {item.macros.carbs} </Text>
        </View>
      </View>
    </Pressable>
  );
};


export default FoodListItem