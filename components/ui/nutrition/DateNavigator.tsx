import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import CalendarPicker from 'react-native-calendar-picker';

interface DateNavigatorProps {
  currentDate: string;
  selectedDateObject: Date;
  onPreviousDate: () => void;
  onNextDate: () => void;
  onDateChange: (date: Date) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  currentDate,
  selectedDateObject,
  onPreviousDate,
  onNextDate,
  onDateChange,
}) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleOpenCalendar = () => {
    setIsCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false);
  };

  const handleCalendarDateChange = (date: Date) => {
    onDateChange(date); // Update the date in the parent component
    handleCloseCalendar(); // Close the calendar
  };

  return (
    <View>
      <View className="mx-4 mb-4 flex-row items-center justify-between rounded-xl border border-indigo-500/30 bg-dark-200/50 p-2">
        <Pressable
          onPress={onPreviousDate}
          className="p-2 active:opacity-70"
          accessibilityLabel="Previous day"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color="#E2DFD2" // text-indigo-400 was in original, but color prop for icon is better
          />
        </Pressable>

        <Pressable
          onPress={handleOpenCalendar}
          className="flex-row items-center space-x-2 py-1 active:opacity-70"
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#E2DFD2" // text-indigo-400 was in original
            className="mr-1" // Adjusted margin slightly
          />
          <Text className="text-sm font-medium text-gray-200">{currentDate}</Text>
        </Pressable>

        <Pressable
          onPress={onNextDate}
          className="p-2 active:opacity-70"
          accessibilityLabel="Next day"
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#E2DFD2" // text-indigo-400 was in original
          />
        </Pressable>
      </View>

      <Modal
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={handleCloseCalendar}
        animationType="fade"
      >
        <Pressable onPress={handleCloseCalendar} className="flex-1 justify-center items-center bg-black/60">
          <Pressable
            onPress={(e) => e.stopPropagation()} // Prevent modal close when clicking inside calendar
            className="bg-slate-800 rounded-xl p-5 shadow-2xl w-11/12 max-w-md"
          >
            <CalendarPicker
              startFromMonday={true}
              onDateChange={handleCalendarDateChange}
              selectedStartDate={selectedDateObject} // Pre-select the current date
              // Styling props for CalendarPicker
              width={300} // Adjust width as needed, or make responsive
              height={320} // Adjust height as needed
              textStyle={{
                color: '#E2DFD2', // Light text for dates (off-white)
                fontFamily: 'System', // Specify font if default is not desired
              }}
              selectedDayStyle={{
                backgroundColor: '#6366F1', // Indigo color for selected day
              }}
              selectedDayTextStyle={{
                color: '#FFFFFF', // White text for selected day
                fontWeight: 'bold',
              }}
              todayBackgroundColor="#4A5568" // A darker gray for today's background (bg-gray-600)
              todayTextStyle={{
                color: '#E2DFD2', // Light text for today
                fontWeight: 'bold',
              }}
              previousTitle="Prev"
              nextTitle="Next"
              previousTitleStyle={{ color: '#A5B4FC', fontWeight: 'bold' }} // Indigo-300
              nextTitleStyle={{ color: '#A5B4FC', fontWeight: 'bold' }} // Indigo-300
              monthTitleStyle={{ color: '#E2DFD2', fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}
              yearTitleStyle={{ color: '#E2DFD2', fontWeight: 'bold', fontSize: 16 }}
              dayShape="circle" // or "square"
              // Custom day header styling
              customDayHeaderStyles={() => {
                return {
                  textStyle: {
                    color: '#A0AEC0', // gray-500
                    fontWeight: 'bold',
                  }
                };
              }}
              // You can further customize arrow components if needed
              // customDatesStyles for specific dates, etc.
            />
            <Pressable
              onPress={handleCloseCalendar}
              className="mt-4 bg-indigo-500 active:bg-indigo-600 py-2.5 px-4 rounded-lg self-center"
            >
              <Text className="text-white font-semibold text-center">Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DateNavigator;