import { AuthProvider, useAuth } from "@/src/context/auth";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function AuthGuard() {
  const { isLoggedIn, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn === undefined) return;

    const isLoginPage = pathname === "/" || pathname === "/index";

    if (!isLoggedIn && !isLoginPage) {
      router.replace("/");
      return;
    }

    if (isLoggedIn && isLoginPage) {
      router.replace("/home");
    }
  }, [isLoggedIn, pathname]);

  if (isLoggedIn === undefined) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
``;
