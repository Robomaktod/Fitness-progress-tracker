import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type FilterOption = "Today" | "Yesterday" | "This Week" | string;

interface FilterTabsProps {
  options: FilterOption[];
  selectedOption: FilterOption;
  onSelectOption: (option: FilterOption) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  options,
  selectedOption,
  onSelectOption,
}) => {
  return (
    <View className="mb-3 flex-row justify-start space-x-2 px-4 py-2">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelectOption(option)}
          className={`rounded-full border px-4 py-2 ${
            selectedOption === option
              ? "border-purple-500 bg-purple-600" // Active state from image (approx)
              : "border-gray-700 bg-dark-200/60" // Inactive state
          }`}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedOption === option }}
          accessibilityLabel={`Filter by ${option}`}
        >
          <Text
            className={`font-semibold ${selectedOption === option ? "text-white" : "text-gray-300"} `}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FilterTabs;