import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts"; // Import from gifted-charts

// import { ComparisonChartDataPoint } from "@/types/health"; // Or types/social
import { ComparisonChartDataPoint } from "@/types/social"; // Update to the correct path where the type is exported

interface ComparisonStatChartProps {
  chartDataPoints: ComparisonChartDataPoint[]; // The original comparison data
  chartTitle?: string;
  yAxisSuffix?: string;
  userLineColor?: string;
  friendLineColor?: string;
  noDataMessage?: string;
  chartHeight?: number;
  xAxisLabelWidth?: number; // Optional: control spacing for X-axis labels
}

const screenWidth = Dimensions.get("window").width;

const ComparisonStatChart: React.FC<ComparisonStatChartProps> = ({
  chartDataPoints,
  chartTitle,
  yAxisSuffix = "",
  userLineColor = "#3B82F6", // Default: Tailwind blue-500
  friendLineColor = "#A78BFA", // Default: Tailwind purple-400
  noDataMessage = "No chart data available for comparison.",
  chartHeight = 200,
  xAxisLabelWidth = 50, // Adjust based on label length and number of points
}) => {
  if (!chartDataPoints || chartDataPoints.length === 0) {
    return (
      <View
        style={{ height: chartHeight }}
        className="items-center justify-center rounded-md bg-dark-100/50 p-4"
      >
        <Text className="text-sm text-gray-400">{noDataMessage}</Text>
      </View>
    );
  }

  // Transform data for react-native-gifted-charts
  const userDataForChart = chartDataPoints.map((point) => ({
    value: point.userValue,
    label: point.label, // Will be used if xAxisLabelTexts is not provided or for reference
    dataPointText: point.userValue.toString(), // Text on data point
  }));

  const friendDataForChart = chartDataPoints.map((point) => ({
    value: point.friendValue,
    // label: point.label, // Labels usually taken from the first dataset or xAxisLabelTexts
    dataPointText: point.friendValue.toString(),
  }));

  // Extract X-axis labels - gifted-charts usually uses the first dataset's labels or a specific prop
  const xAxisLabels = chartDataPoints.map((point) => point.label);

  // Determine max Y value for appropriate yAxis Gutter and scale
  let maxYValue = 0;
  chartDataPoints.forEach((point) => {
    maxYValue = Math.max(maxYValue, point.userValue, point.friendValue);
  });
  // Add some padding to the max Y value for better visualization
  const yAxisMaxValue = Math.ceil((maxYValue * 1.1) / 10) * 10; // Round up to nearest 10 with padding

  return (
    <View className="my-2 items-center">
      {chartTitle && (
        <Text className="mb-2 text-sm font-medium text-gray-300">
          {chartTitle}
        </Text>
      )}
      <LineChart
        isAnimated
        animationDuration={800}
        data={userDataForChart}
        data2={friendDataForChart}
        height={chartHeight}
        width={screenWidth - 80} // Account for card padding (32px) + internal padding (approx 48px for y-axis labels)
        // Colors
        color={userLineColor}
        color2={friendLineColor}
        textColor1={userLineColor} // For data point text color if not customized
        textColor2={friendLineColor}
        // Data Points
        dataPointsColor1={userLineColor}
        dataPointsColor2={friendLineColor}
        dataPointsRadius={3}
        // showDataPointLabel // if you want to show values on points by default

        // Axes
        xAxisLabelTexts={xAxisLabels} // Provide explicit X-axis labels
        xAxisLabelTextStyle={{
          color: "#9CA3AF",
          fontSize: 10,
          width: xAxisLabelWidth,
        }} // gray-400
        xAxisColor={"#4B5563"} // gray-600
        yAxisColor={"#4B5563"} // gray-600
        yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }} // gray-400
        // yAxisSuffix={` ${yAxisSuffix}`}
        yAxisLabelWidth={40} // Adjust based on max value length
        // yAxisLabelPrefix="$" // if needed
        noOfSections={4} // Number of horizontal grid lines / Y-axis sections
        maxValue={yAxisMaxValue} // Set dynamic max value
        mostNegativeValue={0} // If you can have negative values, adjust this
        // fromZero // If you want y-axis to always start from 0

        // Grid & Rules
        rulesColor={"#4B5563"} // gray-600
        rulesType="dashed" // or "solid"
        // showVerticalLines
        // verticalLinesColor="#374151" // gray-700

        // Pointer/Tooltip
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: "lightgray",
          pointerStripWidth: 2,
          pointerColor: "lightgray",
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: (items: any[]) => {
            // items is an array of {value, date/label, etc.}
            return (
              <View className="w-[120px] rounded-md border border-gray-600 bg-dark-200 p-2 shadow-lg">
                <Text className="mb-1 text-center text-xs font-semibold text-white">
                  {items[0]?.label || items[0]?.date || ""}
                </Text>
                {items.map((item, index) => (
                  <View
                    key={index}
                    className="my-0.5 flex-row items-center justify-between"
                  >
                    <View
                      className={`h-2 w-2 rounded-full`}
                      style={{
                        backgroundColor:
                          item.pointerColor ||
                          (index === 0 ? userLineColor : friendLineColor),
                      }}
                    />
                    <Text className="ml-1 flex-1 text-xs text-white/80">
                      {index === 0 ? "You:" : "Friend:"}
                    </Text>
                    <Text className="text-xs font-semibold text-white">
                      {item.value}
                      {yAxisSuffix}
                    </Text>
                  </View>
                ))}
              </View>
            );
          },
        }}
      />
      {/* Optional: Manual Legend if not using chart's built-in (though LineChart supports it) */}
      <View className="mt-3 flex-row justify-center space-x-4">
        <View className="flex-row items-center">
          <View
            className="mr-1.5 h-3 w-3 rounded-sm"
            style={{ backgroundColor: userLineColor }}
          />
          <Text className="text-xs text-gray-300">You</Text>
        </View>
        <View className="flex-row items-center">
          <View
            className="mr-1.5 h-3 w-3 rounded-sm"
            style={{ backgroundColor: friendLineColor }}
          />
          <Text className="text-xs text-gray-300">Friend</Text>
        </View>
      </View>
    </View>
  );
};

export default ComparisonStatChart;