import { StyleSheet, Text, View } from "react-native";

type Props = {
  type?: "success" | "error" | "info" | "null";
  message: string;
};

export function Feedback({ type = "info", message }: Props) {
  const colors = {
    success: "#DCFCE7",
    error: "#FEE2E2",
    info: "#E0F2FE",
    null: "transparent",
  };

  const textColors = {
    success: "#166534",
    error: "#991B1B",
    info: "#075985",
    null: "transparent",
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.text, { color: textColors[type] }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
