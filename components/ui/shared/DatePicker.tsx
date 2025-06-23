import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, minimumDate, maximumDate }) => {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View className="mb-2">
      {label && <Text className="text-white mb-1">{label}</Text>}
      <Pressable
        onPress={() => setShow(true)}
        className="bg-dark-100 px-4 py-2 rounded-lg mb-2"
      >
        <Text className="text-white">
          {value ? value.toISOString().slice(0, 10) : 'Select Date'}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DatePicker;
