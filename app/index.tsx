import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Main = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/sign-up" />;
};

export default Main;
