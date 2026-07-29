import * as Linking from "expo-linking";

import { apiClient } from "@/api/apiClient";

type ClerkError = {
  code?: string;
  longMessage?: string;
  message?: string;
};

type BackendProfileInput = {
  clerkUserId?: string | null;
  displayUsername?: string | null;
  email?: string | null;
};

const firstClerkError = (err: unknown): ClerkError | undefined => {
  const maybeClerkError = err as {
    code?: string;
    errors?: ClerkError[];
    message?: string;
  };

  return maybeClerkError?.errors?.[0] ?? maybeClerkError;
};

export const getClerkErrorCode = (err: unknown) => firstClerkError(err)?.code;

export const getClerkErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  const clerkError = firstClerkError(err);

  return clerkError?.longMessage || clerkError?.message || fallback;
};

export const syncBackendProfile = async ({
  clerkUserId,
  displayUsername,
  email,
}: BackendProfileInput) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!clerkUserId || !normalizedEmail) {
    throw new Error("Cannot create profile without Clerk user id and email.");
  }

  const payload = {
    clerkUserId,
    email: normalizedEmail,
    ...(displayUsername?.trim() && {
      displayUsername: displayUsername.trim(),
    }),
  };

  const { data } = await apiClient.post("/profile", payload);

  return data;
};

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, setActive, signUp } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
    });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });

        if (signUp?.createdUserId && signUp?.emailAddress) {
          try {
            await syncBackendProfile({
              clerkUserId: signUp.createdUserId,
              displayUsername: `${signUp.firstName ?? ""} ${
                signUp.lastName ?? ""
              }`.trim(),
              email: signUp.emailAddress,
            });
          } catch (profileSyncError) {
            console.error("Backend profile sync failed:", profileSyncError);
          }
        }

        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    }

    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: unknown) {
    console.error("Google OAuth failed:", err);
    return {
      success: false,
      code: getClerkErrorCode(err),
      message: getClerkErrorMessage(
        err,
        "An error occurred while signing in with Google",
      ),
    };
  }
};
