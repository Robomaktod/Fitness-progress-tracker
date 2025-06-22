// // Fitness-progress-tracker1/app/(root)/(tabs)/profile.tsx
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router"; // useFocusEffect removed
// import React, { useState, useCallback } from "react"; // useEffect potentially removed if only for fetchData
// import {
//   ScrollView,
//   View,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import CustomButton from "@/components/shared/CustomButton";
// import BodyMetricItem from "@/components/ui/profile/BodyMetricItem";
// import DailyTargetItem from "@/components/ui/profile/DailyTargetItem";
// import ProfileDetailRow from "@/components/ui/profile/ProfileDetailRow";
// import ProfileHeader from "@/components/ui/profile/ProfileHeader";
// import ProfileInfoSection from "@/components/ui/profile/ProfileInfoSection";
// import SectionCard from "@/components/ui/progress/SectionCard";
// import { UserProfileData as FrontendUserProfileData, FitnessGoal } from "@/types/health";
// // import { ApiUser } from "@/types/api";
// // import { useAppAuth } from "@/hooks/useAppAuth";
// // import { useFetchUser, useUpdateUser } from "@/hooks/useUsers";
// // import { mapBackendUserToFrontendProfile } from '@/utils/dataMappers'; 

// const screenBackgroundGradient: readonly [string, string, string] = [
//   "#111827",
//   "#1E1B4B",
//   "#4A044E",
// ];

// const ProfileScreen: React.FC = () => {
//   const router = useRouter();
//   // const { clerkUserId, isAuthLoaded, performSignOut } = useAppAuth();

//   // // Fetch user data using TanStack Query
//   // const {
//   //   data: backendUser, // This will be ApiUser
//   //   isLoading: isLoadingProfile,
//   //   error: fetchProfileError,
//   //   refetch: refetchProfile,
//   //   isFetching: isRefetchingProfile,
//   // } = useFetchUser(clerkUserId, { enabled: isAuthLoaded && !!clerkUserId });

//   // Map backendUser to profileData for UI
//   // const profileData: FrontendUserProfileData | null = backendUser
//   //   ? mapBackendUserToFrontendProfile(backendUser, clerkUser?.imageUrl) // Pass clerk image as fallback
//   //   : null;

//   // useUpdateUser hook (if you have an edit profile feature)
//   // const { mutate: updateUserProfile, isLoading: isUpdatingProfile } = useUpdateUser();

//   const handleEditProfile = () => {
//     Alert.alert("Edit Profile (TBD)", "This feature will allow you to update your profile details.");
//     // Example:
//     // router.push({ pathname: '/(root)/edit-profile', params: { ...profileData } });
//   };

//   const handleLogout = async () => {
//     Alert.alert("Logout", "Are you sure you want to sign out?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Logout", style: "destructive", onPress: () => console.log("Pressed") },
//     ]);
//   };

//   // if (!isAuthLoaded || (isLoadingProfile && !profileData && !fetchProfileError)) {
//   //   return (
//   //     <LinearGradient colors={screenBackgroundGradient} className="flex-1 items-center justify-center">
//   //       <StatusBar barStyle="light-content" backgroundColor={screenBackgroundGradient[0]} />
//   //       <ActivityIndicator size="large" color="#FFFFFF" />
//   //       <Text className="mt-2 text-white">Loading Profile...</Text>
//   //     </LinearGradient>
//   //   );
//   // }

//   // if (fetchProfileError && !profileData) {
//   //    return (
//   //     <LinearGradient colors={screenBackgroundGradient} className="flex-1 items-center justify-center px-4">
//   //       <SafeAreaView edges={["top"]} className="flex-1 items-center justify-center">
//   //         <StatusBar barStyle="light-content" backgroundColor={screenBackgroundGradient[0]} />
//   //         <Text className="text-lg text-red-400 text-center mb-4">Error: {(fetchProfileError as Error).message}</Text>
//   //         <CustomButton title="Retry" onPress={() => refetchProfile()} className="mt-4 w-1/2" />
//   //         <CustomButton title="Logout" onPress={handleLogout} className="mt-4 w-1/2 bg-red-600/70 border border-red-500" isGradientActive={false} textVariant="danger" />
//   //       </SafeAreaView>
//   //     </LinearGradient>
//   //   );
//   // }

//   if (!profileData && !isLoadingProfile) { // If clerkUser is loaded but no profile data (e.g. fetch failed silently or new user not yet in DB)
//      return (
//       <LinearGradient colors={screenBackgroundGradient} className="flex-1 items-center justify-center px-4">
//         <SafeAreaView edges={["top"]} className="flex-1 items-center justify-center">
//           <StatusBar barStyle="light-content" backgroundColor={screenBackgroundGradient[0]} />
//           <Text className="text-lg text-gray-400 text-center mb-4">Could not load profile details. Try refreshing.</Text>
//           <CustomButton title="Retry Fetch" onPress={() => refetchProfile()} className="w-1/2" />
//            <CustomButton title="Logout" onPress={handleLogout} className="mt-4 w-1/2 bg-red-600/70 border border-red-500" isGradientActive={false} textVariant="danger" />
//         </SafeAreaView>
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={screenBackgroundGradient} className="flex-1">
//       <SafeAreaView edges={["top"]} className="flex-1">
//         <StatusBar barStyle="light-content" backgroundColor={screenBackgroundGradient[0]} />
//         <ProfileHeader onActionPress={handleLogout} actionIconName="sign-out-alt" />
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerClassName="px-4 pb-8"
//           refreshControl={
//             <RefreshControl
//               refreshing={isRefetchingProfile}
//               onRefresh={refetchProfile}
//               tintColor="#FFFFFF"
//               colors={["#FFFFFF"]}
//             />
//           }
//         >
//           {profileData && ( // Ensure profileData exists before rendering sections that depend on it
//             <>
//               <ProfileInfoSection
//                 name={profileData.name}
//                 memberSince={profileData.memberSince}
//                 avatarUrl={profileData.avatarUrl}
//                 onEditAvatarPress={() => Alert.alert("Edit Avatar (TBD)", "Avatar editing TBD.")}
//               />

//               <SectionCard borderColorClassName="border-cyan-500/30" shadowColor="#06B6D4" className="bg-dark-200/70">
//                 <Text className="mb-4 text-lg font-semibold text-gray-200">Body Metrics</Text>
//                 <View className="mb-3 flex-row justify-between space-x-3">
//                     <BodyMetricItem label="Current Weight" {...profileData.bodyMetrics.currentWeight} />
//                     <BodyMetricItem label="Goal Weight" {...profileData.bodyMetrics.goalWeight} />
//                 </View>
//                 <View className="flex-row justify-between space-x-3">
//                     <BodyMetricItem label="Height" {...profileData.bodyMetrics.height} />
//                     <BodyMetricItem label="Age" {...profileData.bodyMetrics.age} />
//                 </View>
//               </SectionCard>

//               <SectionCard borderColorClassName="border-purple-500/30" shadowColor="#8B5CF6" className="bg-dark-200/70">
//                 <Text className="mb-3 text-lg font-semibold text-gray-200">Fitness Goals</Text>
//                 <View className="space-y-3">
//                   {profileData.fitnessGoals.map((goal) => (
//                     <ProfileDetailRow
//                       key={goal.id}
//                       label={goal.label}
//                       value={goal.value}
//                       iconName={goal.iconName as any}
//                       iconProvider={goal.iconProvider as any}
//                       iconClassName={goal.iconClassName}
//                       onPress={() => Alert.alert("Edit Goal (TBD)", `Editing ${goal.label} TBD.`)}
//                     />
//                   ))}
//                 </View>
//               </SectionCard>

//               <SectionCard borderColorClassName="border-blue-500/30" shadowColor="#3B82F6" className="bg-dark-200/70">
//                 <Text className="mb-4 text-lg font-semibold text-gray-200">Daily Targets</Text>
//                 <DailyTargetItem label="Calories" {...profileData.dailyTargets.calories} />
//                 <View className="mt-3 flex-row justify-between space-x-2">
//                     <View className="flex-1"><DailyTargetItem label="Protein" {...profileData.dailyTargets.protein} /></View>
//                     <View className="flex-1"><DailyTargetItem label="Carbs" {...profileData.dailyTargets.carbs} /></View>
//                     <View className="flex-1"><DailyTargetItem label="Fat" {...profileData.dailyTargets.fat} /></View>
//                 </View>
//               </SectionCard>

//               <View className="mt-6 space-y-3">
//                 <CustomButton
//                   title="Edit Profile"
//                   onPress={handleEditProfile}
//                   className="border border-purple-500/50 bg-purple-600/30"
//                   isGradientActive={false}
//                 />
//               </View>
//             </>
//           )}
//         </ScrollView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// export default ProfileScreen;