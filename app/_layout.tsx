import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { AuthProvider } from "../src/context/auth";
LogBox.ignoreLogs(["Invalid DOM property", "Unknown event handler property"]);

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
