// Fitness-progress-tracker1/app/(root)/(tabs)/profile.tsx
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // useFocusEffect removed
import React, { useState, useCallback } from "react"; // useEffect potentially removed if only for fetchData
import {
  ScrollView,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFetchUser, useUpdateUser } from "@/api/useUserProfile";
import CustomButton from "@/components/shared/CustomButton";
import BodyMetricItem from "@/components/ui/profile/BodyMetricItem";
import DailyTargetItem from "@/components/ui/profile/DailyTargetItem";
import ProfileDetailRow from "@/components/ui/profile/ProfileDetailRow";
import ProfileHeader from "@/components/ui/profile/ProfileHeader";
import ProfileInfoSection from "@/components/ui/profile/ProfileInfoSection";
import SectionCard from "@/components/ui/progress/SectionCard";
import {
  UserProfileData as FrontendUserProfileData,
  FitnessGoal,
} from "@/types/health";
// import { ApiUser } from "@/types/api";
// import { useAppAuth } from "@/hooks/useAppAuth";

const screenBackgroundGradient: readonly [string, string, string] = [
  "#111827",
  "#1E1B4B",
  "#4A044E",
];

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { userId, isLoaded: isAuthLoaded, signOut } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // Fetch user data using TanStack Query
  const {
    data: backendUser,
    isLoading: isLoadingProfile,
    error: fetchProfileError,
    refetch: refetchProfile,
    isFetching: isRefetchingProfile,
  } = useFetchUser(userId ?? "", { enabled: isAuthLoaded && !!userId });

  // Map backendUser to profileData for UI (real data)
  function mapBackendUserToFrontendProfile(
    backendUser: any,
  ): FrontendUserProfileData {
    // Use latest weight log for currentWeight
    const latestWeightLog = backendUser.weightLogs?.length
      ? backendUser.weightLogs.reduce((a: any, b: any) =>
          new Date(a.loggedAt) > new Date(b.loggedAt) ? a : b,
        )
      : null;
    const latestWeight = latestWeightLog ? latestWeightLog.weightKg : null;
    // Use first weight log for goalWeight (or fallback)
    const goalWeight = backendUser.goalWeight || null;
    // Calculate age from dateOfBirth
    const age = backendUser.dateOfBirth
      ? Math.floor(
          (Date.now() - new Date(backendUser.dateOfBirth).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        )
      : null;
    // Calculate daily norma (BMR * 1.2)
    let dailyNorma = null;
    if (
      backendUser.heightCm &&
      latestWeight &&
      backendUser.dateOfBirth &&
      backendUser.gender
    ) {
      const now = new Date();
      const birth = new Date(backendUser.dateOfBirth);
      const userAge =
        now.getFullYear() -
        birth.getFullYear() -
        (now < new Date(birth.setFullYear(now.getFullYear())) ? 1 : 0);
      const s = backendUser.gender === "Male" ? 5 : -161;
      const bmr =
        10 * Number(latestWeight) +
        6.25 * Number(backendUser.heightCm) -
        5 * userAge +
        s;
      dailyNorma = Math.round(bmr * 1.2);
    }
    return {
      name: backendUser.displayUsername || backendUser.email || "User Name",
      avatarUrl: undefined, // Add avatar logic if available
      memberSince: backendUser.createdAt
        ? new Date(backendUser.createdAt).toLocaleDateString()
        : "",
      bodyMetrics: {
        currentWeight: {
          id: "currentWeight",
          label: "Current Weight",
          value: latestWeight ? latestWeight.toString() : "-",
          unit: "kg",
          valueClassName: "text-cyan-400",
        },
        goalWeight: {
          id: "goalWeight",
          label: "Goal Weight",
          value: goalWeight ? goalWeight.toString() : "-",
          unit: "kg",
          valueClassName: "text-purple-400",
        },
        height: {
          id: "height",
          label: "Height",
          value: backendUser.heightCm?.toString() || "-",
          unit: "cm",
          valueClassName: "text-blue-400",
        },
        age: {
          id: "age",
          label: "Age",
          value: age ? age.toString() : "-",
          unit: "yrs",
          valueClassName: "text-green-400",
        },
      },
      fitnessGoals: backendUser.fitnessGoals || [], // Only if you add this to your schema
      dailyTargets: {
        calories: {
          id: "calories",
          label: "Calories",
          value: dailyNorma ? dailyNorma.toString() : "-",
          unit: "kcal",
          valueClassName: "text-blue-400",
        },
        protein: {
          id: "protein",
          label: "",
          value: "",
          unit: "",
          valueClassName: "",
        },
        carbs: {
          id: "carbs",
          label: "",
          value: "",
          unit: "",
          valueClassName: "",
        },
        fat: { id: "fat", label: "", value: "", unit: "", valueClassName: "" },
      },
    };
  }

  const profileData: FrontendUserProfileData | null = backendUser
    ? mapBackendUserToFrontendProfile(backendUser as any)
    : null;

  const { mutate: updateUserProfile } = useUpdateUser();

  const handleEditProfile = () => {
    const user = backendUser as any;
    setEditForm({
      name: user.displayUsername || "",
      heightCm: user.heightCm || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
        : "",
      currentWeight: user.weightLogs?.length
        ? user.weightLogs.reduce((a: any, b: any) =>
            new Date(a.loggedAt) > new Date(b.loggedAt) ? a : b,
          ).weightKg
        : "",
      goalWeight: user.goalWeight || "",
      fitnessGoals: user.fitnessGoals || [],
    });
    setEditVisible(true);
  };

  const handleSaveEdit = () => {
    updateUserProfile(
      { userId: userId ?? "", update: editForm },
      {
        onSuccess: () => {
          setEditVisible(false);
          refetchProfile();
        },
      },
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  if (
    !isAuthLoaded ||
    (isLoadingProfile && !profileData && !fetchProfileError)
  ) {
    return (
      <LinearGradient
        colors={screenBackgroundGradient}
        className="flex-1 items-center justify-center"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="mt-2 text-white">Loading Profile...</Text>
      </LinearGradient>
    );
  }

  if (fetchProfileError && !profileData) {
    return (
      <LinearGradient
        colors={screenBackgroundGradient}
        className="flex-1 items-center justify-center px-4"
      >
        <SafeAreaView
          edges={["top"]}
          className="flex-1 items-center justify-center"
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor={screenBackgroundGradient[0]}
          />
          <Text className="mb-4 text-center text-lg text-red-400">
            Error: {(fetchProfileError as Error).message}
          </Text>
          <CustomButton
            title="Retry"
            onPress={() => refetchProfile()}
            className="mt-4 w-1/2"
          />
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            className="mt-4 w-1/2 border border-red-500 bg-red-600/70"
            isGradientActive={false}
            textVariant="danger"
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!profileData && !isLoadingProfile) {
    // If clerkUser is loaded but no profile data (e.g. fetch failed silently or new user not yet in DB)
    return (
      <LinearGradient
        colors={screenBackgroundGradient}
        className="flex-1 items-center justify-center px-4"
      >
        <SafeAreaView
          edges={["top"]}
          className="flex-1 items-center justify-center"
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor={screenBackgroundGradient[0]}
          />
          <Text className="mb-4 text-center text-lg text-gray-400">
            Could not load profile details. Try refreshing.
          </Text>
          <CustomButton
            title="Retry Fetch"
            onPress={() => refetchProfile()}
            className="w-1/2"
          />
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            className="mt-4 w-1/2 border border-red-500 bg-red-600/70"
            isGradientActive={false}
            textVariant="danger"
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={screenBackgroundGradient} className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={screenBackgroundGradient[0]}
        />
        <ProfileHeader
          onActionPress={handleLogout}
          actionIconName="sign-out-alt"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-8"
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingProfile}
              onRefresh={refetchProfile}
              tintColor="#FFFFFF"
              colors={["#FFFFFF"]}
            />
          }
        >
          {profileData && ( // Ensure profileData exists before rendering sections that depend on it
            <>
              <ProfileInfoSection
                name={profileData.name}
                memberSince={profileData.memberSince}
                avatarUrl={profileData.avatarUrl}
                onEditAvatarPress={() =>
                  Alert.alert("Edit Avatar (TBD)", "Avatar editing TBD.")
                }
              />

              <SectionCard
                borderColorClassName="border-cyan-500/30"
                shadowColor="#06B6D4"
                className="bg-dark-200/70"
              >
                <Text className="mb-4 text-lg font-semibold text-gray-200">
                  Body Metrics
                </Text>
                <View className="mb-3 flex-row justify-between space-x-3">
                  <BodyMetricItem {...profileData.bodyMetrics.currentWeight} />
                  <BodyMetricItem {...profileData.bodyMetrics.goalWeight} />
                </View>
                <View className="flex-row justify-between space-x-3">
                  <BodyMetricItem {...profileData.bodyMetrics.height} />
                  <BodyMetricItem {...profileData.bodyMetrics.age} />
                </View>
              </SectionCard>

              <SectionCard
                borderColorClassName="border-purple-500/30"
                shadowColor="#8B5CF6"
                className="bg-dark-200/70"
              >
                <Text className="mb-3 text-lg font-semibold text-gray-200">
                  Fitness Goals
                </Text>
                <View className="space-y-3">
                  {profileData.fitnessGoals.map((goal) => (
                    <ProfileDetailRow
                      key={goal.id}
                      label={goal.label}
                      value={goal.value}
                      iconName={goal.iconName as any}
                      iconProvider={goal.iconProvider as any}
                      iconClassName={goal.iconClassName}
                      onPress={() =>
                        Alert.alert(
                          "Edit Goal (TBD)",
                          `Editing ${goal.label} TBD.`,
                        )
                      }
                    />
                  ))}
                </View>
              </SectionCard>

              <SectionCard
                borderColorClassName="border-blue-500/30"
                shadowColor="#3B82F6"
                className="bg-dark-200/70"
              >
                <Text className="mb-4 text-lg font-semibold text-gray-200">
                  Daily Targets
                </Text>
                <DailyTargetItem {...profileData.dailyTargets.calories} />
              </SectionCard>

              <View className="mt-6 space-y-3">
                <CustomButton
                  title="Edit Profile"
                  onPress={handleEditProfile}
                  className="border border-purple-500/50 bg-purple-600/30"
                  isGradientActive={false}
                />
              </View>
            </>
          )}
        </ScrollView>
        <Modal visible={editVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.7)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#222",
                padding: 24,
                borderRadius: 16,
                width: "90%",
              }}
            >
              <Text className="mb-4 text-lg font-bold text-white">
                Edit Profile
              </Text>
              <TextInput
                placeholder="Name"
                value={editForm.name}
                onChangeText={(v) =>
                  setEditForm((f: any) => ({ ...f, name: v }))
                }
                className="mb-2 rounded bg-dark-100 p-2 text-white"
                placeholderTextColor="#aaa"
              />
              <TextInput
                placeholder="Height (cm)"
                value={editForm.heightCm?.toString()}
                onChangeText={(v) =>
                  setEditForm((f: any) => ({ ...f, heightCm: v }))
                }
                keyboardType="numeric"
                className="mb-2 rounded bg-dark-100 p-2 text-white"
                placeholderTextColor="#aaa"
              />
              <TextInput
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={editForm.dateOfBirth}
                onChangeText={(v) =>
                  setEditForm((f: any) => ({ ...f, dateOfBirth: v }))
                }
                className="mb-2 rounded bg-dark-100 p-2 text-white"
                placeholderTextColor="#aaa"
              />
              <TextInput
                placeholder="Current Weight (kg)"
                value={editForm.currentWeight?.toString()}
                onChangeText={(v) =>
                  setEditForm((f: any) => ({ ...f, currentWeight: v }))
                }
                keyboardType="numeric"
                className="mb-2 rounded bg-dark-100 p-2 text-white"
                placeholderTextColor="#aaa"
              />
              <TextInput
                placeholder="Goal Weight (kg)"
                value={editForm.goalWeight?.toString()}
                onChangeText={(v) =>
                  setEditForm((f: any) => ({ ...f, goalWeight: v }))
                }
                keyboardType="numeric"
                className="mb-2 rounded bg-dark-100 p-2 text-white"
                placeholderTextColor="#aaa"
              />
              {/* Fitness Goals editing UI (simple text for now) */}
              <TextInput
                placeholder="Fitness Goals (comma separated)"
                value={
                  Array.isArray(editForm.fitnessGoals)
                    ? editForm.fitnessGoals
                        .map((g: any) => g.value || g)
                        .join(", ")
                    : ""
                }
                onChangeText={(v) =>
                  setEditForm((f: any) => ({
                    ...f,
                    fitnessGoals: v.split(",").map((g: string) => ({
                      id: g.trim(),
                      label: g.trim(),
                      value: g.trim(),
                    })),
                  }))
                }
                className="mb-2 rounded bg-dark-100 p-2 text-white"
                placeholderTextColor="#aaa"
              />
              <View className="mt-4 flex-row justify-between">
                <CustomButton
                  title="Cancel"
                  onPress={() => setEditVisible(false)}
                  className="mr-2 flex-1 bg-gray-700"
                  isGradientActive={false}
                />
                <CustomButton
                  title="Save"
                  onPress={handleSaveEdit}
                  className="ml-2 flex-1 bg-purple-600"
                  isGradientActive={false}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;
